import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./EditPostPage.css";
import PostService, { IPost } from "../../services/post-service";
import { AxiosResponse } from "axios";

function EditPostPage() {
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<(() => void | undefined) | undefined>();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const [post, setPost] = useState<IPost | null>(null);
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
    // Fetch post data based on postId when component mounts
    const fetchPost = async () => {
      try {
        const res = await PostService.getOneById("/" + postId); // Example method to fetch post by ID from service
        cancelRef.current = res.cancel;
        const response: AxiosResponse<IPost> = await res.req;
        setPost(response.data);
        setFormData({
          type: response.data.type,
          gpu: response.data.gpu,
          cpu: response.data.cpu,
          motherboard: response.data.motherboard,
          memory: response.data.memory,
          ram: response.data.ram,
          image: response.data.image,
        });
      } catch (error) {
        console.error("Error fetching original post:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

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
          _id: postId!,
          comments: post.comments,
        };
        try {
          const res = await PostService.update(editedPost,'?postId=');
          cancelRef.current = res.cancel;
          navigate("/Profile/MyPosts?userId="+post.owner);
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
