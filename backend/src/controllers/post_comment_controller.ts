
import { Request, Response } from "express";
import BaseController from "./base_controller";
import PostComment,{ IPostComment } from "../models/post_comment_model";

class PostCommentController extends BaseController<IPostComment> {
  constructor() {
    super(PostComment);
  }
  async get(req: Request, res: Response) {
    try{
    if (req.params.id != null) {
      const myObjects = await this.model.find({postId:req.params.id});
      return res.status(200).send(myObjects);
  } 
    else{
      res.status(400).send("missing id");
    }
  }
  catch(error)
  {
    res.status(500).send(error);
  }
}
}
export default new PostCommentController();