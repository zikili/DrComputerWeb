import express from "express";
const router = express.Router();
import UserController from "../controllers/user_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/", authMiddleware, UserController.get.bind(UserController));
router.get("/:id", authMiddleware, UserController.get.bind(UserController));

//post
router.post("/", authMiddleware, UserController.post.bind(UserController));

//put
router.put("/", authMiddleware, UserController.put.bind(UserController));

//delete
router.delete("/", authMiddleware, UserController.delete.bind(UserController));

export default router;
