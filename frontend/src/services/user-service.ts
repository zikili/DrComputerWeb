import { CredentialResponse } from '@react-oauth/google';

import apiClient from "./api-client"

export interface IUser {
    email: string,
    password?: string,
    image: string,
    username:string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export interface IProfile {
    email: string,
    username:string,
    image: string
}

export interface IEditProfile {
    email: string,
    password: string,
    username:string
    image: string,
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

    updateUserProfile=(profile:IProfile,password:string)=>{
        return new Promise<IProfile>((resolve, reject) => {
            console.log("Updating user profile...")
            apiClient.put("/auth/update", {profile:profile,password:password},{headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              }}).then((response) => {
                console.log(response)
                resolve(response.data)
            }).catch((error) => {
                console.log(error)
                reject(error)
            })
        })
    }

    jwtAuthentication=(credentialResponse:CredentialResponse)=>{
        return new Promise<ITokens>((resolve, reject) => {
            console.log("Registering user..."+credentialResponse.credential)
            apiClient.post("/auth/googleSignin", {credential:credentialResponse.credential}).then((response) => {
                console.log("Service response"+response)
                resolve(response.data)
            }).catch((error) => {
                console.log(error)
                reject(error)
            })
        })
    }

    getUserProfile = () => {
        return new Promise<IProfile>((resolve, reject) => {
            console.log("Get Info user...")
            apiClient.get("/auth/info",{headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              }}).then((response) => {
                console.log(response)
                resolve(response.data)
            }).catch((error) => {
                console.log(error)
                reject(error)
            })
        })
    }

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