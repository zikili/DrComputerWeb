import express from "express";
const router = express.Router();
import StudentController from "../controllers/student_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.get("/", authMiddleware, StudentController.get.bind(StudentController));
router.get("/:id", authMiddleware, StudentController.get.bind(StudentController));

//post
router.post("/", authMiddleware, StudentController.post.bind(StudentController));

//put
router.put("/", authMiddleware, StudentController.put.bind(StudentController));

//delete
router.delete("/", authMiddleware, StudentController.delete.bind(StudentController));

export default router;