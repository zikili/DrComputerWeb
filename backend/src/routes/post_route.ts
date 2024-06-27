import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/",authMiddleware, PostController.get.bind(PostController));
router.get("/:id",authMiddleware, PostController.get.bind(PostController));

//post
router.post("/", authMiddleware, PostController.post.bind(PostController));

//put
router.put("/",authMiddleware, PostController.put.bind(PostController));

//delete
router.delete("/",authMiddleware, PostController.delete.bind(PostController));

export default router;