import React, { useState } from "react";
import axios, { CanceledError } from "axios";
import "./RegisterPage.css";

function RegisterPage() {
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
        const dataAuth = { email, password };
        const dataUser = { username, image: "image" };
        const registerResponse = await axios.post(
          "http://localhost:3000/auth/register",
          dataAuth,
          { signal: controller.signal }
        );
        const loginResponse = await axios.post(
          "http://localhost:3000/auth/login",
          dataAuth,
          { signal: controller.signal }
        );
        console.log("Registration Successful:", registerResponse.data);
        console.log("Login Successful:", loginResponse.data);
        setMessage("Registration Successful!");

        //TODO save accessToken in local storage
        const headers = {
          Authorization: `Bearer ${loginResponse.data.accessToken}`,
          "Content-Type": "application/json", // Adjust content type as needed
        };
        const userResponse = await axios.post(
          "http://localhost:3000/user/",
          dataUser,
          { headers, signal: controller.signal }
        );
        setError("");
        console.log(userResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error instanceof CanceledError) return;
        console.error("Registration Error:", error);
        setError(
          "An error occurred during registration. Please try again later."
        );
        setMessage("");
      } finally {
        setIsLoading(false);
      }
      return () => controller.abort();
    }
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <h1>Register</h1>
      </div>
      <form className="register-form" onSubmit={onSubmit}>
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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {isLoading && <div className="spinner-border text-primary" />}
        {message && <p className="message">{message}</p>}
        {error && <div className="alert alert-danger">{error}</div>}
      </form>
    </div>
  );
}

export default RegisterPage;
