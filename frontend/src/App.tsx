// src/App.tsx

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginForm from "./components/Login/LoginForm";
import RegisterForm from "./components/Register/RegisterPage";
import UploadPostForm from "./components/UploadPost/PostPage";
import HomePage from "./components/Home/HomePage";
import StartPage from "./components/Start/StartPage";
import FeedPage from './components/Feed/FeedPage';
import ProfilePage from './components/Profile/ProfilePage';
import CommentsPage from './components/Comments/CommentsPage';
import EditPostPage from './components/EditPost/EditPostPage';
import MyPostsPage from './components/MyPosts/MyPostsPage';
import EditProfilePage from './components/EditProfile/EditProfilePage';
import ArticlePage from './components/Article/ArticlePage';
import NavBar from './components/NavBar/NavBarPage';
import './App.css';

const AppContent = () => {
  const location = useLocation();

  // List of routes where the NavBar should not be displayed
  const noNavBarRoutes = ["/Login", "/Register", "/"];

  return (
    <div className="app-container">
      {!noNavBarRoutes.includes(location.pathname) && <NavBar />}
      <div className="content-container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Feed" element={<FeedPage />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Register" element={<RegisterForm />} />
          <Route path="/Post" element={<UploadPostForm />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Article" element={<ArticlePage />} />
          <Route path="/Post/Comments" element={<CommentsPage />} />
          <Route path="/Post/Edit" element={<EditPostPage />} />
          <Route path="/Profile/MyPosts" element={<MyPostsPage />} />
          <Route path="/Profile/EditProfile" element={<EditProfilePage />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
