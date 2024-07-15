import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ProfilePage.css";
import UserService, { IProfile} from "../../services/user-service";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
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
        console.log(profileData);
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

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
      {isLoading ? (
        <div className="spinner-border text-primary" />
      ) : (
        <div className="profile-container">
          <img src={profile.image} alt="Profile" className="profile-image" />
          <div className="profile-info">
            <div className="profile-field">
              <label>Username:</label>
              <span>{profile.username}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{profile.email}</span>
            </div>
          </div>
          {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
          <button className="editProfileBTN myButton" onClick={()=>navigate('/Profile/EditProfile')}>Edit Profile</button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
