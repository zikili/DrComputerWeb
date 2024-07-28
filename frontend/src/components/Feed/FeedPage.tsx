import { useState, useEffect, useRef } from "react";
import PostService, { IPost } from "../../services/post-service"; // Adjust the path as per your project structure
import axios, { AxiosResponse } from "axios";
import "./FeedPage.css";
import { useNavigate } from "react-router-dom";

function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Prevent state update on unmounted component
  const cancelRef = useRef<(() => void | undefined) | undefined>();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        PostService.getAll().then(async (res) => {
          cancelRef.current = res.cancel;
          const response: AxiosResponse<IPost[]> = await res.req;
          setPosts(response.data);
        }); // Await for the getAll() result
      } catch (error) {
        if (axios.isCancel(error))
          console.log("Request canceled:", error.message);
        setError("Error fetching posts");
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
    return () => {
      console.log("canceling");
      if (cancelRef.current) cancelRef.current(); // Prevent state update on destructed component
    };
  }, []); // Include cancelToken in dependencies to handle cleanup correctly

  const handlePostClick = (postId: string) => {
    navigate(`/Post/Comments?postId=${postId}`);
  };

  return (
    <div className="feed-page">
      <h1>All Posts</h1>
      {isLoading ? (
        <div className="spinner-border text-primary" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : posts?.length === 0 ? (
        <div className="no-posts">
          <h3>No posts have been uploaded.</h3>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post, index) => (
            <div
              key={index}
              className="post-item"
              onClick={() => handlePostClick(post._id!)}
            >
              <h2>{post.type}</h2>
              <p>GPU: {post.gpu}</p>
              <p>CPU: {post.cpu}</p>
              <p>Motherboard: {post.motherboard}</p>
              <p>Memory: {post.memory}</p>
              <p>RAM: {post.ram}</p>
              <p>comments: {post.comments}</p>
              <img src={post.image} alt="Post Image" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedPage;
