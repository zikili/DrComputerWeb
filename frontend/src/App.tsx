import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          <Route path="/Post/Comments" element={<CommentsPage />} />
          <Route path="/Post/Edit" element={<EditPostPage />} />
          <Route path="/Profile/MyPosts" element={<MyPostsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
