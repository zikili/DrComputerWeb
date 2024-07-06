import  PostController  from './post_controller';
import { getUserName } from "../controllers/auth_controller";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import PostComment,{ IPostComment } from "../models/post_comment_model";
import { AuthRequest } from "./auth_controller";


class PostCommentController extends BaseController<IPostComment> {
  constructor() {
    super(PostComment);
  }
  async get(req: AuthRequest, res: Response) {
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

async post(req: AuthRequest, res: Response) {
  const _id = req.user._id;
  req.body.userId = _id;
  const username:string=await getUserName(req)
  req.body.userName =username
  PostController.addComment(req.body.postId)
  super.post(req, res);
}

async deleteMany(req: Request, res: Response) {
  const postId=req.body.id
  try{
    await this.model.deleteMany({postId:postId});
    res.status(200).send();
  }
  catch(error)
  {
    res.status(500).send(error);
  }
}
}
export default new PostCommentController();