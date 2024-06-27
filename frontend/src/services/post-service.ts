import axios from 'axios';
import apiClient from './api-client'; // Adjust path as per your project structure
import { refreshTokens } from './user-service';
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
    comments: IPostComment[];

}

class PostService {
  async post(user: IPost): Promise<IPost | string> {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const response = await apiClient.post("/post/", user, { headers });

      return response.data; // Return posted data
    } catch (error:unknown) {
      if (axios.isAxiosError(error)&&error.response && error.response.status === 403) {
        // Token refresh logic
        const tokens = await refreshTokens();
        console.log(tokens)
        if (tokens) {
          // Retry posting after token refresh
          const retryResponse = await this.post(user);
          return retryResponse;
        } else {
          console.error("Failed to refresh tokens");
          throw ("Failed to refresh tokens") // Handle failure to refresh tokens
        }
      } else {
        console.error("Error posting:", error);
        throw ("Error posting:"+ error); // Handle other posting errors
      }
    }
  }
}

export default new PostService();
