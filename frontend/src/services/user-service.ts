
import apiClient from "./api-client"

export interface IUser {
    email: string,
    password?: string,
    image: string,
    username:string
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export interface IloginUser{
    email:string,
    password:string
}
export interface ITokens{
    accessToken:string,
    refreshToken:string
}
class UserService{
     registerUser = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
        console.log("Registering user...")
        console.log(user)
        apiClient.post("/auth/register", user).then((response) => {
            console.log(response)
            localStorage.setItem("accessToken",response.data.accessToken)
            localStorage.setItem("refreshToken",response.data.refreshToken)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}
     loginUser = (user:IloginUser) => {
    return new Promise<ITokens>((resolve, reject) => {
        console.log("Loging in user...")
        apiClient.post("/auth/login", user).then((response) => {
            localStorage.setItem("accessToken",response.data.accessToken)
            localStorage.setItem("refreshToken",response.data.refreshToken)
            console.log(response)
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })
    })
}



      refreshTokens= async()=> {
        localStorage.removeItem("accessToken")

        return new Promise<ITokens>((resolve, reject) => {
    apiClient.get("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        "Content-Type": "application/json",
      },
    }).then((response)=>{
        localStorage.removeItem("refreshToken")
        console.log(response)
        const tokens:ITokens= {
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          };
          console.log(tokens.refreshToken);
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
         resolve(tokens);
    }).catch((error) => {
        console.log(error)
        reject(error)
    }) ;

  })
}

logoutUser = () => {
    return new Promise<Response>((resolve, reject) => {
        console.log("Logging out user...")
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          apiClient.get("/auth/logout",{ headers: 
          {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        }).then((response) => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken");
            resolve(response.data)
        }).catch((error) => {
            console.log(error)
            reject(error)
        })  
    }})
}
}
export default UserService