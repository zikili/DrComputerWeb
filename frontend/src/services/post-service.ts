import { CanceledError } from 'axios';
// import axios from 'axios';
// import apiClient from './api-client'; // Adjust path as per your project structure
// import UserService from './user-service';
import createHttpService from './http-service';

export interface IPostComment {
    userId: string;
    content: string;
}
export interface IPost {
    _id?: string;
    owner?: string;
    type: string;
    gpu: string;
    cpu: string;
    motherboard: string;
    memory: string;
    ram: string;
    image: string;
    comments: number;
}
export{CanceledError}

const PostService = createHttpService<IPost>('/post');


export default PostService;
