import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./EditProfilePage.css";
import UserService, { IProfile } from "../../services/user-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadPhoto } from "../../services/file-service";
import avatar from '/assets/avatar.jpg';
function EditProfilePage() {
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [profile, setProfile] = useState<IProfile>({
    username: "",
    email: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const userService: UserService = new UserService();
        const profileData = await userService.getUserProfile(); 
        setProfile(profileData);
        setError("");
      } catch (error: unknown) {
        console.error("Profile Error:", error);
        setError("An error occurred while fetching the profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!profile.username) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      if(imgSrc){
        profile.image = await uploadPhoto(imgSrc);
      }
      const userService: UserService = new UserService();
      await userService.updateUserProfile(profile, password); // Assume there's a method to update profile
      setError("");
      navigate('/Profile'); // Redirect to the profile page after saving
    } catch (error: unknown) {
      console.error("Update Error:", error);
      setError("An error occurred while updating the profile. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/Profile'); // Redirect to the profile page without saving
  };

  const imgSelected = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const deleteImg = () => {
    setImgSrc(null);
    setProfile(prevProfile => ({
      ...prevProfile,
      image: avatar
    }));
  }
  return (
    <div className="edit-profile-page">
      <div className="profile-header">
        <h1>Edit Profile</h1>
      </div>
      {isLoading ? (
        <div className="spinner-border text-primary" />
      ) : (
        <div className="profile-container">
          <div className="profile-field">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="profile-field">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="profile-field">
            <div className="d-flex justify-content-center position-relative">
              <img src={imgSrc ? URL.createObjectURL(imgSrc) : profile.image} style={{ height: "230px", width: "230px" }} className="img-fluid" />
              <button type="button" className="btn-square position-absolute bottom-0 end-0" onClick={selectImg}>
                <FontAwesomeIcon icon={faImage} className="fa-xl" />
              </button>
            </div>
            <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
          </div>
          {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
          <div className="delete-button">
            <button className="btn btn-danger" onClick={deleteImg}>Delete Image</button>
          </div>
          <div className="button-group">
            <button className="btn btn-primary" onClick={handleSave}>SAVE</button>
            <button className="btn btn-secondary" onClick={handleCancel}>CANCEL</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfilePage;
