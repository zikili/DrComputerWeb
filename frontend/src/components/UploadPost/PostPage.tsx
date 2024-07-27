import React, { ChangeEvent, useRef, useState } from "react";
import axios, { CanceledError } from "axios";
import "./PostPage.css";
import PostService from "../../services/post-service";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadPhoto } from "../../services/file-service";
import emptyImage from '/assets/empty_image.jpg'
function PostPage() {
   const img=emptyImage
   const [imgSrc, setImgSrc] = useState<File>()
   const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [gpu, setGpu] = useState("");
  const [cpu, setCpu] = useState("");
  const [motherboard, setMotherboard] = useState("");
  const [memory, setMemory] = useState("");
  const [ram, setRam] = useState("");
  const [errors, setErrors] = useState({
    type: "",
    gpu: "",
    cpu: "",
    motherboard: "",
    memory: "",
    ram: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const cancelRef=useRef<(() => void | undefined) | undefined>();
  if(cancelRef.current)
    cancelRef.current()
  const validateForm = () => {
    let valid = true;
    const errors = {
      type: "",
      gpu: "",
      cpu: "",
      motherboard: "",
      memory: "",
      ram: "",
      image: "",
    };

    if (type.trim() === "") {
      errors.type = "Type is required";
      valid = false;
    }
    if (gpu.trim() === "") {
      errors.gpu = "GPU is required";
      valid = false;
    }
    if (cpu.trim() === "") {
      errors.cpu = "CPU is required";
      valid = false;
    }
    if (motherboard.trim() === "") {
      errors.motherboard = "MotherBoard is required";
      valid = false;
    }
    if (memory.trim() === "") {
      errors.memory = "Memory is required";
      valid = false;
    }
    if (ram.trim() === "") {
      errors.ram = "RAM is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };
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
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      let image=img;
      if(imgSrc)
        image = await uploadPhoto(imgSrc!);
      setIsLoading(true);
      try {
        const dataPost = {
          type,
          cpu,
          gpu,
          motherboard,
          memory,
          ram,
          image,
          comments: 0,
        };
        const {req,cancel} = await PostService.post(dataPost);
        cancelRef.current=cancel;
        console.log("Upload Successful:", req.data);
        setMessage("Upload Successful!");
        setError("");
        navigate("/Feed");
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && (error instanceof CanceledError||axios.isCancel(error))) {
          console.log("CANCELTA OTANU");
          return;
        }
        if (axios.isAxiosError(error) && error.status === 403) {
          console.error("Refresh Error:", error);
          setError("An error occurred during authentication.");
          setMessage("");
        } else {
          console.error("Upload Post Error:", error);
          setError("An error occurred during upload. Please try again later.");
          setMessage("");
        }
      } finally {
        setIsLoading(false);
      }
    }
    return () => {
      if(cancelRef.current)
        cancelRef.current()
    }
  };

  return (
    <div className="post-page">
      <div className="post-form-container">
        <h1>Post Your Setup</h1>
        <form className="form-group" onSubmit={onSubmit}>
          <div className="d-flex justify-content-center position-relative">
            <img src={imgSrc ? URL.createObjectURL(imgSrc) : img} style={{ height: "230px", width: "230px" }} className="img-fluid" />
            <button type="button" className="btn-square position-absolute bottom-0 end-0" onClick={selectImg}>
            <FontAwesomeIcon icon={faImage} className="fa-xl" />
            </button>
          </div>
      <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
          <div className="form-group">
            <label htmlFor="type" className="form-label">
              Type:
            </label>
            <input
              type="text"
              id="type"
              name="type"
              className="form-control"
              value={type}
              onChange={(event) => setType(event.target.value)}
            />
            {errors.type && <small className="error">{errors.type}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="gpu" className="form-label">
              GPU:
            </label>
            <input
              type="text"
              id="gpu"
              name="gpu"
              className="form-control"
              value={gpu}
              onChange={(event) => setGpu(event.target.value)}
            />
            {errors.gpu && <small className="error">{errors.gpu}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="cpu" className="form-label">
              CPU:
            </label>
            <input
              type="text"
              id="cpu"
              name="cpu"
              className="form-control"
              value={cpu}
              onChange={(event) => setCpu(event.target.value)}
            />
            {errors.cpu && <small className="error">{errors.cpu}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="motherboard" className="form-label">
              MotherBoard:
            </label>
            <input
              type="text"
              id="motherboard"
              name="motherboard"
              className="form-control"
              value={motherboard}
              onChange={(event) => setMotherboard(event.target.value)}
            />
            {errors.motherboard && (
              <small className="error">{errors.motherboard}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="memory" className="form-label">
              Memory:
            </label>
            <input
              type="text"
              id="memory"
              name="memory"
              className="form-control"
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
            />
            {errors.memory && <small className="error">{errors.memory}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="ram" className="form-label">
              RAM:
            </label>
            <input
              type="text"
              id="ram"
              name="ram"
              className="form-control"
              value={ram}
              onChange={(event) => setRam(event.target.value)}
            />
            {errors.ram && <small className="error">{errors.ram}</small>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
          </button>
          {isLoading && <div className="spinner-border text-primary" />}
          {message && <p className="message">{message}</p>}
          {error && <div className="alert alert-danger">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default PostPage;
