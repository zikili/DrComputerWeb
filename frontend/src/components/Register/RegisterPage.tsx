import React, { ChangeEvent, useRef, useState } from "react";
import axios, { CanceledError } from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterPage.css";
import UserService from "../../services/user-service";
import { useNavigate } from "react-router-dom";
import { uploadPhoto } from "../../services/file-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import logoimp from "/assets/logo.png";
import avatar from "/assets/avatar.jpg";
function RegisterPage() {
  const img = avatar;
  const logo = logoimp;
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };
  const selectImg = () => {
    console.log("Selecting image...");
    fileInputRef.current?.click();
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateForm = () => {
    let valid = true;
    const errors = { username: "", email: "", password: "" };

    if (username.trim() === "") {
      errors.username = "Username is required";
      valid = false;
    } else if (username.length > 10) {
      errors.username = "Username cannot exceed 10 characters";
      valid = false;
    }

    if (email.trim() === "") {
      errors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(email)) {
      errors.email = "Email is not valid";
      valid = false;
    }

    if (password.trim() === "") {
      errors.password = "Password is required";
      valid = false;
    } else if (password.length > 20) {
      errors.password = "Password cannot exceed 20 characters";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const controller = new AbortController();
      setIsLoading(true);
      try {
        let image = img;
        if (imgSrc) image = await uploadPhoto(imgSrc!);
        console.log("upload returned:" + image);
        const registerData = { username, email, password, image };
        const userService: UserService = new UserService();
        const registerResponse = await userService.registerUser(registerData);
        const loginResponse = await userService.loginUser({ email, password });
        console.log("Registration Successful:", registerResponse);
        console.log("Login Successful:", loginResponse);
        setMessage("Registration Successful!");
        setError("");
        navigate("/Feed");
      } catch (error) {
        if (axios.isAxiosError(error) && error instanceof CanceledError) return;
        console.error("Registration Error:", error);
        if (axios.isAxiosError(error))
          if (error.response) setError(error.response.data);
        setMessage("");
      } finally {
        setIsLoading(false);
      }
      return () => controller.abort();
    }
  };

  return (
    <div className="register-page">
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>
      <div className="register-header">
        <h1>Register</h1>
      </div>
      <form className="register-form" onSubmit={onSubmit}>
        <div className="d-flex justify-content-center position-relative">
          <img
            src={imgSrc ? URL.createObjectURL(imgSrc) : img}
            style={{ height: "230px", width: "230px" }}
            className="img-fluid"
          />
          <button
            type="button"
            className="btn-square position-absolute bottom-0 end-0"
            onClick={selectImg}
          >
            <FontAwesomeIcon icon={faImage} className="fa-xl" />
          </button>
        </div>
        <input
          style={{ display: "none" }}
          ref={fileInputRef}
          type="file"
          onChange={imgSelected}
        ></input>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            value={username}
            maxLength={10}
            onChange={(event) => setUserName(event.target.value)}
          />
          {errors.username && (
            <small className="error">{errors.username}</small>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={password}
            maxLength={20}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && (
            <small className="error">{errors.password}</small>
          )}
        </div>
        <div className="row d-flex justify-content-center align-content-center ">
          <button type="submit" className="btn btn-block btn-primary">
            Register
          </button>
        </div>
        {isLoading && <div className="spinner-border text-primary" />}
        {message && <p className="message">{message}</p>}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
export default RegisterPage;
