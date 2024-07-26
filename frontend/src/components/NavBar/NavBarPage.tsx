import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { CanceledError } from 'axios';
import UserService from "../../services/user-service";
import './NavBarPage.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  
   const logoutFunction = async () => {
    const userService:UserService = new UserService();
    setIsLoading(true)
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
    <nav className="nav-bar">
      <button className="postBTN myButton" onClick={() => navigate('/Post')}>Post</button>
      <button className="feedBTN myButton" onClick={() => navigate('/Feed')}>Feed</button>
      <button className="myPostsBTN myButton" onClick={() => navigate('/Profile/MyPosts')}>myPosts</button>
      <button className="profileBTN myButton" onClick={() => navigate('/Profile')}>Profile</button>
      <button className="articleBTN myButton" onClick={() => navigate('/Article')}>Articles</button>
      <button className="logoutBTN" onClick={async () => await logoutFunction()}>LogOut</button>
      <div>
          {isLoading && <div className="spinner-border text-primary" />}
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

    </nav>
  );
}

export default NavBar;
