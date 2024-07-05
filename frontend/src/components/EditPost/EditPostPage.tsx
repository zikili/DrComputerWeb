import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditPostPage.css";
import { IPost } from "../../services/post-service";

function EditPostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "",
    gpu: "",
    cpu: "",
    motherboard: "",
    memory: "",
    ram: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    type: "",
    gpu: "",
    cpu: "",
    motherboard: "",
    memory: "",
    ram: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      type: "",
      gpu: "",
      cpu: "",
      motherboard: "",
      memory: "",
      ram: "",
      image: "",
    };

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key as keyof typeof newErrors] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitted", formData);
      // TODO: add service call here
      //service should take send with update with the postId url part
      navigate("/");
    }
  };

  const fields = [
    { name: "type", maxLength: 20 },
    { name: "gpu", maxLength: 20 },
    { name: "cpu", maxLength: 20 },
    { name: "motherboard", maxLength: 20 },
    { name: "memory", maxLength: 20 },
    { name: "ram", maxLength: 20 },
    { name: "image", maxLength: 20 },
  ];

  return (
    <div className="edit-post-page">
      <h1>Edit Post</h1>
      <form className="edit-post-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name} className="form-label">
              {field.name.charAt(0).toUpperCase() + field.name.slice(1)}:
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              className="form-control"
              value={formData[field.name as keyof typeof formData]}
              maxLength={field.maxLength}
              onChange={handleChange}
            />
            {errors[field.name as keyof typeof errors] && (
              <small className="error">
                {errors[field.name as keyof typeof errors]}
              </small>
            )}
          </div>
        ))}
        <div className="btn-container">
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPostPage;
