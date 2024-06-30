import express from "express";
const router = express.Router();
import PostCommentController from "../controllers/post_comment_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/", authMiddleware, PostCommentController.get.bind(PostCommentController));


router.get("/:id", authMiddleware, PostCommentController.get.bind(PostCommentController));

//post
router.post("/", authMiddleware, PostCommentController.post.bind(PostCommentController));

//put(edit)
router.put("/", authMiddleware, PostCommentController.put.bind(PostCommentController));

//delete
router.delete("/", authMiddleware, PostCommentController.delete.bind(PostCommentController));

export default router;