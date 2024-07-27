
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import UserService from "../../services/user-service";
import './HomePage.css';
import image from '/assets/logo.png'; // Correctly importing the image

function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const logoutFunction = async () => {
    const userService: UserService = new UserService();
    await userService.logoutUser()
      .then(() => {
        setIsLoading(false);
        console.log("Logout success");
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
        setError("Wrong credentials, please try again.");
        setIsLoading(false);
      });
  }

  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={image} alt="Logo" /> {/* Referencing the imported image */}
      </div>
      <h1>Home Page</h1>
      <div className="button-container">
        <button className="postBTN myButton" onClick={() => navigate('/Post')}>Post</button>
        <button className="feedBTN myButton" onClick={() => navigate('/Feed')}>Feed</button>
        <button className="profileBTN myButton" onClick={() => navigate('/Profile')}>Profile</button>
        <button className="articleBTN myButton" onClick={() => navigate('/Article')}>Articles</button>
        <button className="logoutBTN" onClick={async () => await logoutFunction()}>LogOut</button>
      </div>
      <div>
        {isLoading && <div className="spinner-border text-primary" />}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}

export default HomePage;
