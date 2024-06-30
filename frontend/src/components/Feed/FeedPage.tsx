import React, { useState, useEffect,useRef } from 'react';
import PostService, { IPost } from '../../services/post-service'; // Adjust the path as per your project structure
import axios, {  AxiosResponse } from 'axios';
import './FeedPage.css';
const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading,setIsLoading]=useState(false)
  const [error, setError] = useState<string|null>(null);
 // Prevent state update on unmounted component
  const cancelRef=useRef<(() => void | undefined) | undefined>();
  if(cancelRef.current)
    cancelRef.current()
  useEffect(() => {

      const fetchData = async () => {
          try {
            setIsLoading(true);
              const { req, cancel } = await PostService.getAll(); // Await for the getAll() result
              cancelRef.current=cancel
              // Attach the cancel token to the axios request
              const response: AxiosResponse<IPost[]> = await req;
              setPosts(response.data);
          } catch (error) {
            
              if (axios.isCancel(error)) {
                  console.log('Request canceled:', error.message);
              } else {
                setError("Error fetching posts")
                  console.error('Error fetching posts:', error);
              }
          }
          finally {
            setIsLoading(false);
          }
      };

      fetchData();

      return () => {
        if(cancelRef.current)
        cancelRef.current() // Prevent state update on unmounted component
      };
  }, []); // Include cancelToken in dependencies to handle cleanup correctly

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
