import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
//import PostService, { IComment } from '../../services/post-service'; // Adjust the path as per your project structure
import './CommentsPage.css'; // Create and style this CSS file

function CommentsPage() {
  const { postId } = useParams<{ postId: string }>();
  //const [comments, setComments] = useState<IComment[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if (postId) {
    //   setIsLoading(true);
    //   PostService.getCommentsByPostId(postId)
    //     .then((response: AxiosResponse<IComment[]>) => {
    //       setComments(response.data);
    //     })
    //     .catch((error) => {
    //       setError("Error fetching comments");
    //       console.error('Error fetching comments:', error);
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    // }
  }, [postId]);

  const handleSubmit = (event: React.FormEvent) => {
    // event.preventDefault();
    // if (postId) {
    //   setIsLoading(true);
    //   PostService.addComment(postId, { content })
    //     .then((response: AxiosResponse<IComment>) => {
    //       setComments([...comments, response.data]);
    //       setContent('');
    //     })
    //     .catch((error) => {
    //       setError("Error adding comment");
    //       console.error('Error adding comment:', error);
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     });
    // }
  };

  return (
    <div className="comments-page">
      <div className="comments-section">
        {/* Commented out loading and error handling for now */}
        {/* {isLoading ? (
          <div className="spinner-border text-primary" />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <p>{comment.content}</p>
            </div>
          ))
        )} */}
      </div>
      <div className="comment-form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Comment:</label>
            <textarea
              id="content"
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentsPage;
