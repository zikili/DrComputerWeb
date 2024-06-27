import axios from "axios";
import apiClient,{CanceledError} from "./api-client";
import UserService from "./user-service";


{CanceledError}
interface BaseEntity{
    _id?:string;
}

//Base Service
class HttpService<T extends BaseEntity>{
    endpoint:string;
    constructor(endpoint:string){
        this.endpoint=endpoint;
    }
    getAll(){
        const controller=new AbortController();
        const request= apiClient.get<T[]>(this.endpoint,{signal:controller.signal})
        return {request,cancel:()=>controller.abort}
    }
    async post(object: T): Promise<T|string> {
        const controller = new AbortController();
        try {
            const response = await apiClient.post<T>(this.endpoint , object, {
                signal: controller.signal,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  "Content-Type": "application/json",
                },
              });
          return response.data; // Return posted data
        } catch (error: unknown) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
            // Token refresh logic
            const userService:UserService=new UserService();
            const tokens = await userService.refreshTokens();
            if (tokens) {
              // Retry posting after token refresh
              const retryResponse = await this.post(object);
              return retryResponse;
            } else {
              throw new Error('Failed to authenticate');
            }
          } else {
            throw new Error('Error posting: ' + error);
          }
        }
      }
        update(object:T){
            const controller=new AbortController();
            const request= apiClient.put<T[]>(this.endpoint+object._id,object,{signal:controller.signal})
            return {request,cancel:()=>controller.abort}
        }
        
        delete(id:string){
            const controller=new AbortController();
            const request= apiClient.delete<T[]>(this.endpoint + id,{signal:controller.signal})
            return {request,cancel:()=>controller.abort}
        }

    }   

const createHttpService=<T extends BaseEntity>(endpoint:string)=>new HttpService<T>(endpoint);

export default createHttpService;