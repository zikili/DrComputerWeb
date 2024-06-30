//TODO check if works
import PostComment, { IPostComment } from "../models/post_comment_model";

import BaseController from "./base_controller";

class UserController extends BaseController<IPostComment> {
  constructor() {
    super(PostComment);
  }
}
export default new UserController();