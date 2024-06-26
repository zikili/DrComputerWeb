import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import UserService from "../../services/user-service";
import './HomePage.css';
import { CanceledError } from 'axios';

function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  
   const logoutFunction = async () => {
    const userService:UserService = new UserService();
    await userService.logoutUser()
      .then(() => {
        setIsLoading(false);
        console.log("Logout success");
        navigate('/');
      })
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
        setError("Wrong credentials, please try again.");
        setIsLoading(false);
      });
  }
  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <div className="button-container">
        <button className="postBTN" onClick={() => navigate('/Post')}>Post</button>
        <button className="logoutBTN" onClick={async () => await logoutFunction()}>LogOut</button>
        <button className="feedBTN" onClick={() => navigate('/Feed')}>Feed</button>
      </div>
      <div>
          {isLoading && <div className="spinner-border text-primary" />}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
    </div>
  );
}

export default HomePage;
