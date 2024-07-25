import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import './CommentsPage.css'; // Ensure this file is created and properly styled
import PostCommentService, { IPostComment } from '../../services/comment-service';

function CommentsPage() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');
  const [comments, setComments] = useState<IPostComment[]>([]);
  const [content, setContent] = useState('');
  const cancelRef = useRef<(() => void | undefined) | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      setIsLoading(true);
      PostCommentService.getAllById("/" + postId)
        .then(async (res) => {
          cancelRef.current = res.cancel;
          const response: AxiosResponse<IPostComment[]> = await res.req;
          setComments(response.data);
        })
        .catch((error) => {
          setError('Error fetching comments');
          console.error('Error fetching comments:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (postId) {
      setIsLoading(true);
      const newComment: IPostComment = {
        content,
        postId,
      };
      PostCommentService.post(newComment)
        .then(async (res) => {
          cancelRef.current = res.cancel;
          const response: AxiosResponse<IPostComment> = await res.req;
          setContent('');
          setComments([...comments, response.data]);
        })
        .catch((error) => {
          setError('Error adding comment');
          console.error('Error adding comment:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="comments-page">
      <div className="comments-section">
        {isLoading ? (
          <div className="spinner-border text-primary" />
        ) : comments ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <p><strong>{comment.userName}:</strong> {comment.content}</p>
            </div>
          ))
        ):(
          <div className="alert alert-danger">{error}</div>
        ) }
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
