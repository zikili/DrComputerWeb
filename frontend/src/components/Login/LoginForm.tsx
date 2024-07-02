import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./LoginForm.css"; // Import your CSS file
import UserService, { IloginUser } from "../../services/user-service";
import { CanceledError } from "axios";
import { useNavigate } from 'react-router-dom';
import {GoogleLogin, CredentialResponse } from '@react-oauth/google';
import {jwt_decode} from "jwt-decode";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
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
        navigate('/Home');
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
      const decoded:any = jwt_decode(credentialResponse.credential);
      const dataAuth = {
        username: decoded.name+"G",
        email: decoded.email,
        password: "123456",
        image: decoded.picture
      }
      try{
        const userService:UserService = new UserService();
        const registerResponse = await userService.registerUser(dataAuth);
        console.log("Registration Successful:", registerResponse);
      }catch(error){
        console.log(error);
        console.log("User already exists");
      }
      navigate('/Home');
    } catch (error) {
      console.log("Failed to sign in with Google, please try again later.");
    }
  }


  const onFailure = () =>{
    console.log("Google Error");
  }

  return (
    <div className="form-container">
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
function jwt_decode(credential: string | undefined) {
  throw new Error("Function not implemented.");
}

