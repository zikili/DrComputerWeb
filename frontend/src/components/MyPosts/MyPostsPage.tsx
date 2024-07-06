import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostService, { IPost } from "../../services/post-service";
import "./MyPostsPage.css"; // Make sure to create this CSS file
import { AxiosResponse } from "axios";

function MyPostsPage() {
  const navigate = useNavigate();
  const cancelRef = useRef<(() => void | undefined) | undefined>();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [posts, setPosts] = useState<IPost[] | null>(null); // Type assertion here

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await PostService.getAllById("?userId=" + userId);
        cancelRef.current = await res.cancel;
        const response: AxiosResponse<IPost[]> = await res.req;
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    if (userId) {
      fetchPost();
    }
  }, [userId]);

  const handleEdit = (postId: string) => {
    // Navigate to the edit post page with postId
    navigate(`/Post/Edit?postId=${postId}`);
  };

  const handleDelete = async (postId: string) => {
    try {
      const res = await PostService.delete(postId);
      cancelRef.current = await res.cancel;
      const response: AxiosResponse<IPost> = await res.req
      console.log(response.data);
      setPosts((prevPosts) => 
        prevPosts!.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      // TODO handle error
    }
  };

  return (
    <div className="my-posts-page">
      <h1>My Posts</h1>
      <div className="posts-list">
        {posts?.map((post) => (
          <div key={post._id} className="post-card">
            <h2>{post.type}</h2>
            <p>
              <strong>GPU:</strong> {post.gpu}
            </p>
            <p>
              <strong>CPU:</strong> {post.cpu}
            </p>
            <p>
              <strong>Motherboard:</strong> {post.motherboard}
            </p>
            <p>
              <strong>Memory:</strong> {post.memory}
            </p>
            <p>
              <strong>RAM:</strong> {post.ram}
            </p>
            <p>
              <strong>Image:</strong> {post.image}
            </p>
            <img src={post.image} alt="Post Image" className="post-image" />
            <div className="post-actions">
              <button onClick={() =>{if(post._id) handleEdit(post._id)}}>Edit</button>
              <button onClick={() => {if(post._id)handleDelete(post._id)}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPostsPage;
