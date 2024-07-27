import { useNavigate } from 'react-router-dom';
import './StartPage.css';
import image from '/assets/logo.png';
function StartPage() {
  const logo=image
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>
      <h1>Welcome !</h1>
      <div className="button-container">
        <button className="nav-button" onClick={() => navigate('/Login')}>Login</button>
        <button className="nav-button" onClick={() => navigate('/Register')}>Register</button>
      </div>
    </div>
  );
}

export default StartPage;
