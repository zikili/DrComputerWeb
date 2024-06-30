import  { useState, useEffect } from "react";
import PostService, { IPost } from "../../services/post-service";
import "./FeedPage.css";
import axios, { CanceledError } from "axios";



function FeedPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState<IPost[]>([])
    const [error, setError] = useState()
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          const { req, cancel } = await PostService.getAll();
          try {
            const res = req;
            setPosts(res);
          } catch (err) { 
            if (err instanceof CanceledError) {
              console.log("Request canceled:", err.message);
              return ()=>cancel();
            }
            setError(axios.isAxiosError(err)&&err.response?.data || "Failed to fetch posts");
            if(axios.isAxiosError(err)&&err.message==='Network Error')
              {
                   console.log("Error fetching posts:", err)
              }
         
          } finally {
            setIsLoading(false);
          }
    
          return () => {
            cancel();
          };
        };
    
        fetchData();
      }, []);
  return (
    <div className="feed-page">
      <h1>All Posts</h1>
      {isLoading ? (
        <div className="spinner-border text-primary" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="posts-list">
          {posts.map((post, index) => (
            <div key={index} className="post-item">
              <h2>{post.type}</h2>
              <p>GPU: {post.gpu}</p>
              <p>CPU: {post.cpu}</p>
              <p>Motherboard: {post.motherboard}</p>
              <p>Memory: {post.memory}</p>
              <p>RAM: {post.ram}</p>
              <img src={post.image} alt="Post Image" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default FeedPage;
