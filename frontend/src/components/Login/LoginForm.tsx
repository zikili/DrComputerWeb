import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./LoginForm.css"; // Import your CSS file
import UserService, { IloginUser } from "../../services/user-service";
import { CanceledError } from "axios";
import { useNavigate } from 'react-router-dom';
import {GoogleLogin, CredentialResponse } from '@react-oauth/google';
import logoimp from '/assets/logo.png';

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  console.log("in login")
  const logo=logoimp
  const navigate = useNavigate();
  console.log("LoginForm");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = async (data: IloginUser) => {
    console.log("onsubmit", data);
    const userService:UserService = new UserService();
    await userService.loginUser(data)
      .then(() => {
        setIsLoading(false);
        console.log("login success");
        navigate('/Feed');
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
        setError("Wrong credentials, please try again.");
        setIsLoading(false);
      });

  };

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      console.log(credentialResponse);
      if(credentialResponse.credential){
      const userService=new UserService()
      const decodeRes=await userService.jwtAuthentication(credentialResponse)
        localStorage.setItem('accessToken',(decodeRes).accessToken)
        localStorage.setItem('refreshToken', (decodeRes).refreshToken)
      }
      navigate('/Feed');
    } catch (error) {
      console.log("Failed to sign in with Google, please try again later.");
    }
  }


  const onFailure = () =>{
    console.log("Google Error");
  }

  return (
    <div className="form-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>
      <div className="login-header">
        <h1>Login</h1>
      </div>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            {...register("email", {
              required: true,
              minLength: 5,
              maxLength: 10,
            })}
          />
          {errors.email && (
            <div className="text-danger">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            {...register("password", { required: true, minLength: 3 })}
          />
          {errors.password && (
            <div className="text-danger">{errors.password.message}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Log In
        </button>
        <div className="signGoogle">
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onFailure}
        />
      </div>
        <div>
          {isLoading && <div className="spinner-border text-primary" />}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
export interface GoogleResponse{email:string, name:string, picture:string}


