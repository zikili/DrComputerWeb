import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IPost } from '../../services/post-service';
import './MyPostsPage.css'; // Make sure to create this CSS file

function MyPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<(IPost & { _id: string })[]>([]); // Type assertion here

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data= //TODO service to fetch all posts by userId
            
        setPosts(data); 
      } catch (error) {
        console.error('Error fetching posts:', error);

      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (postId: string) => {
    // Navigate to the edit post page with postId
    navigate(`/Post/Edit/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    try {
        //TODO use delete service to delete post
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      // TODO handle error
    }
  };

  return (
    <div className="my-posts-page">
      <h1>My Posts</h1>
      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <h2>{post.type}</h2>
            <p><strong>GPU:</strong> {post.gpu}</p>
            <p><strong>CPU:</strong> {post.cpu}</p>
            <p><strong>Motherboard:</strong> {post.motherboard}</p>
            <p><strong>Memory:</strong> {post.memory}</p>
            <p><strong>RAM:</strong> {post.ram}</p>
            <p><strong>Image:</strong> {post.image}</p>
            <img src={post.image} alt="Post Image" className="post-image" />
            <div className="post-actions">
              <button onClick={() => handleEdit(post._id)}>Edit</button>
              <button onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPostsPage;
