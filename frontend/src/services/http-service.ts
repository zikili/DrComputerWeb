import axios, { AxiosResponse } from "axios";
import apiClient,{CanceledError} from "./api-client";


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
    async getAll(): Promise<{ req: T[]; cancel: () => void }> {
      const controller = new AbortController();
      const { signal } = controller;
  
      try {
        const response: AxiosResponse<T[]> = await apiClient.get<T[]>(this.endpoint, {
          signal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        });
        return { req: response.data, cancel: () => controller.abort() }; // Access the data property
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          throw error;
        }
        console.log(error);
        throw error
      }
    }
  
  
    async post(object: T) {
        const controller = new AbortController();
        try {
            const req = await apiClient.post<T>(this.endpoint , object, {
                signal: controller.signal,
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  "Content-Type": "application/json",
                },
              });
              return { req, cancel: () => controller.abort() }; // Return posted data
        } catch (error: unknown) {
          if (axios.isCancel(error)) return;
            throw new Error('Error posting: ' + error);
        }
      }
        async update(object:T){
            const controller=new AbortController();
            const request= await apiClient.put<T[]>(this.endpoint+object._id,object,{signal:controller.signal})
            return {request,cancel:()=>controller.abort}
        }
        
        async delete(id:string){
            const controller=new AbortController();
            const request= await apiClient.delete<T[]>(this.endpoint + id,{signal:controller.signal})
            return {request,cancel:()=>controller.abort}
        }

    }   

const createHttpService=<T extends BaseEntity>(endpoint:string)=>new HttpService<T>(endpoint);

export default createHttpService;