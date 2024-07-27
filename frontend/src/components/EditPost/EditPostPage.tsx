import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditPostPage.css";
import PostService, { IPost } from "../../services/post-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadPhoto } from "../../services/file-service";
import emptyImage from '/assets/empty_image.jpg'
function EditPostPage() {
  const [imgSrc, setImgSrc] = useState<File | null>(null)
  let myImage: string = "";
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    if (e.target.files && e.target.files.length > 0) {
        setImgSrc(e.target.files[0])
    }
}
  const selectImg = () => {
    console.log("Selecting image...")
    fileInputRef.current?.click()
}

const deleteImg = () => {
  setImgSrc(null);
  myImage = emptyImage
};

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
        if(myImage == "")
        {
          myImage = post.post.image;
        }
        if(imgSrc){
          myImage = await uploadPhoto(imgSrc!);
        }
        const editedPost: IPost & { _id: string; comments: number } = {
          type:formData.type,
          gpu: formData.gpu,
          cpu: formData.cpu,
          motherboard: formData.motherboard,
          memory: formData.memory,
          ram: formData.ram,
          image: myImage,
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
          <div className="d-flex justify-content-center position-relative">
            <img src={imgSrc ? URL.createObjectURL(imgSrc) : post.post.image} style={{ height: "230px", width: "230px" }} className="img-fluid" />
            <button type="button" className="btn-square position-absolute bottom-0 end-0" onClick={selectImg}>
            <FontAwesomeIcon icon={faImage} className="fa-xl" />
            </button>
          </div>
      <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
        <div className="form-group">
          <button type="button" className="btn btn-danger" onClick={deleteImg}>
            Delete Image
          </button>
        </div>
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
