import  { useState, useEffect,useRef } from 'react';
import PostService, { IPost } from '../../services/post-service'; // Adjust the path as per your project structure
import axios, {  AxiosResponse, CanceledError } from 'axios';
import './FeedPage.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading,setIsLoading]=useState(false)
  const [error, setError] = useState<string|null>(null);
 // Prevent state update on unmounted component
  const cancelRef=useRef<(() => void | undefined) | undefined>();
  if(cancelRef.current)
    cancelRef.current()
  useEffect(() => {
          try {
            setIsLoading(true);
               PostService.getAll().then(async (res)=>{
                cancelRef.current=res.cancel
                const response: AxiosResponse<IPost[]> =  await res.req;
                setPosts(response.data);
              }); // Await for the getAll() result
          } catch (error) {
            
              if (axios.isCancel(error)||error instanceof CanceledError ) {
                setIsLoading(false);
                return 
              }
                else if(error instanceof DOMException && error.name === 'AbortError')
                  {
                    console.log('Request aborted')
                    setIsLoading(false);
                    return () => {
                      if(cancelRef.current)
                      cancelRef.current() // Prevent state update on destructed component
                    };
                  }
              else {
                setError("Error fetching posts")
                  console.error('Error fetching posts:', error);
              }
          }
          finally {
            setIsLoading(false);
          }
          return () => {
            if(cancelRef.current)
            cancelRef.current() // Prevent state update on destructed component
          };

  }, []); // Include cancelToken in dependencies to handle cleanup correctly

  const handlePostClick = (postId: string) => {
    navigate(`/Comments/${postId}`);
  };

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
            <div key={index} className="post-item" onClick={() => handlePostClick(post._id!)}>
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
