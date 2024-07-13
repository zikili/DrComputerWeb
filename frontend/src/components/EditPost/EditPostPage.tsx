import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditPostPage.css";
import PostService, { IPost } from "../../services/post-service";

function EditPostPage() {
  const location = useLocation();
  const post = location.state as { post: IPost }
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<(() => void | undefined) | undefined>();
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

  useEffect(() => {
    if (post) {
      setFormData({
        type:post.post.type,
        gpu: post.post.gpu,
        cpu: post.post.cpu,
        motherboard: post.post.motherboard,
        memory: post.post.memory,
        ram: post.post.ram,
        image: post.post.image,
      });
    }
  }, [post]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Submitted", formData);
      if (post) {
        const editedPost: IPost & { _id: string; comments: number } = {
          ...formData,
          _id: post.post._id!,
          comments: post.post.comments,
          owner: post.post.owner,  // Ensure you include the owner field if it's needed
        };
        try {
          const res = await PostService.update(editedPost, '?postId=');
          cancelRef.current = res.cancel;
          navigate("/Profile/MyPosts");
        } catch (error) {
          console.error("Error updating post:", error);
          setError("An error occurred while updating the post.");
        }
      }
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
        {error && <div className="alert alert-danger">{error}</div>}
      </form>
    </div>
  );
}

export default EditPostPage;
