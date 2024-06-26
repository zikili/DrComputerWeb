import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import axios, { CanceledError } from "axios";
import "./LoginForm.css"; // Import your CSS file

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  console.log("LoginForm");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const onSubmit = (data: FieldValues) => {
    console.log("onsubmit", data);
    const controller = new AbortController();
    setIsLoading(true);
    axios
      .post("http://localhost:3000/auth/login", data, {
        signal: controller.signal,
      })
      .then((response) => {
        console.log(response.data);
        setIsLoading(false);
        console.log("login success");
        localStorage.setItem('accessToken', token);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
        setError(error.message);
        setIsLoading(false);
      });
    return () => controller.abort();
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
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
          Submit
        </button>
        <div>
          {isLoading && <div className="spinner-border text-primary" />}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
