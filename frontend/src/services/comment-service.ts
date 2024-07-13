import { CanceledError } from 'axios';
// import axios from 'axios';
// import apiClient from './api-client'; // Adjust path as per your project structure
// import UserService from './user-service';
import createHttpService from './http-service';


export interface IPostComment {
    _id?:string
    postId: string;
    userId?: string;
    content: string;
    userName?:string;
}
export{CanceledError}

const PostCommentService = createHttpService<IPostComment>('/post/comments');



export default PostCommentService;
