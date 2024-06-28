
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
        console.log(user)
        apiClient.post("http://localhost:3000/auth/login", user).then((response) => {
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

    logoutUser = () => {
    return new Promise<Response>((resolve, reject) => {
        console.log("Logging out user...")
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          apiClient.get("http://localhost:3000/auth/logout",{ headers: 
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

     async refreshTokens(): Promise<ITokens> {
    // Example logic to refresh tokens (replace with your actual implementation)
    const response = await apiClient.get("http://localhost:3000/auth/refresh", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
        "Content-Type": "application/json",
      },
    });
    
    const tokens:ITokens= {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    return tokens;
  }
}
export default UserService