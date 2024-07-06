import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterPage";
import UploadPostForm from "./components/UploadPost/PostPage";
import HomePage from "./components/Home/HomePage";
import StartPage from "./components/Start/StartPage";
import FeedPage from './components/Feed/FeedPage';
import ProfilePage from './components/Profile/ProfilePage';
import CommentsPage from './components/Comments/CommentsPage';
import React from 'react';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Feed" element={<FeedPage />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Post" element={<UploadPostForm />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Comments/:postId" element={<CommentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
