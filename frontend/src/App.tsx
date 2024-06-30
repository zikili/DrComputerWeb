import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterPage";
import UploadPostForm from "./components/Post/PostPage";
import HomePage from "./components/Home/HomePage";
import StartPage from "./components/Start/StartPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Post" element={<UploadPostForm />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
