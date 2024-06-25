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
}

export default new PostController();
