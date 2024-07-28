
import apiClient,{CanceledError} from "./api-client";


{CanceledError}
interface BaseEntity{
    _id?:string;
}

//Base Service
export class HttpService<T extends BaseEntity>{
    endpoint:string;
    constructor(endpoint:string){
        this.endpoint=endpoint;
    }

    async getAll(param:string="") {
      const controller = new AbortController();  
      try{
        const response =  apiClient.get<T[]>(this.endpoint+param, {
          signal:controller.signal,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }); 
        return { req: response, cancel: () => controller.abort() }; // Access the data property
      }
       catch (error) {
        if(error instanceof CanceledError)
            throw error.message
        if(error instanceof DOMException && error.name === 'AbortError')
          console.log('User Aborted');
          throw "error in getAll at HttpService"
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
        } catch (error) {
            throw "error in post at HttpService"
        }
      }
        async update(object:T,param?:string){
            const controller=new AbortController();
            try {
              const req = await apiClient.put<T>(this.endpoint+param+object._id , object, {
                  signal: controller.signal,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                  },
                });
                return { req, cancel: () => controller.abort() }; // Return posted data
          } catch (error) {
              throw "error in put at HttpService"
          }
        }

        
        async delete(id:string){
            const controller=new AbortController();
            try {
              const req = await apiClient.delete<T>(this.endpoint, {
                  signal: controller.signal,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                  },
                  data:{id}
                });
                return { req, cancel: () => controller.abort() }; // Return posted data
          } catch (error) {
              throw "error in delete at HttpService"
          }
        }

        async getAllById(id:string) {
          const controller = new AbortController();  
          try{
            const response =  apiClient.get<T[]>(this.endpoint + id, {
              signal:controller.signal,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            }); 
            return { req: response, cancel: () => controller.abort() }; // Access the data property
          }
           catch (error) {
            if(error instanceof CanceledError)throw "cancelled"
            if(error instanceof DOMException && error.name === 'AbortError')
            {
              console.log('User Aborted');
            }
        
              throw "error fetching data"
        } 
      }
    }  
    
    
 
const createHttpService=<T extends BaseEntity>(endpoint:string)=>new HttpService<T>(endpoint);

export default createHttpService;