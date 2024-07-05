import Post, { IPost } from "../models/post_model";
import BaseController from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "./auth_controller";

class PostController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async post(req: AuthRequest, res: Response) {
    const _id = req.user._id;
    req.body.owner = _id;
    super.post(req, res);
  }

  async addComment(postId:string) {
    try{
      await Post.updateOne({ _id: postId }, { $inc: { comments: 1 } });
    }
    catch(error){
      console.error('Failed to update comments count:', error);
      throw new Error('Failed to update comments count');
    }
  }
}

export default new PostController();
