import { useNavigate } from 'react-router-dom';
import './StartPage.css';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Start Page</h1>
      <div className="button-container">
        <button className="nav-button" onClick={() => navigate('/Login')}>Login</button>
        <button className="nav-button" onClick={() => navigate('/Register')}>Register</button>
      </div>
    </div>
  );
}

export default StartPage;
