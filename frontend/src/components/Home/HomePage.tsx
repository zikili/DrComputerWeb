import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Main Page</h1>
      <div className="button-container">
        <button className="nav-button" onClick={() => navigate('/Login')}>Login</button>
        <button className="nav-button" onClick={() => navigate('/Register')}>Register</button>
        <button className="nav-button" onClick={() => navigate('/Post')}>Post</button>
      </div>
    </div>
  );
}

export default HomePage;
