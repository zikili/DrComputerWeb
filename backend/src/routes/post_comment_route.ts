import express from "express";
const router = express.Router();
import PostCommentController from "../controllers/post_comment_controller";
import { authMiddleware } from "../controllers/auth_controller";
/**
 * @swagger
 * components:
 *   schemas:
 *     Tokens:
 *       type: object
 *       required:
 *         - accessToken
 *         - refreshToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The JWT access token
 *         refreshToken:
 *           type: string
 *           description: The JWT refresh token
 *       example:
 *         accessToken: '123cd123x1xx1'
 *         refreshToken: '134r2134cr1x3c'
 *     FullPostComment:
 *       type: object
 *       required:
 *         - _id
 *         - userName
 *         - postId
 *         - userId
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The id of the comment
 *         userName:
 *           type: string
 *           description: The name of the user who posted the comment
 *         postId:
 *           type: string
 *           description: The id of the post the comment is associated with
 *         userId:
 *           type: string
 *           description: The id of the user who posted the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *       example:
 *         _id: '123'
 *         userName: 'Shmulik'
 *         postId: '123'
 *         userId: '123'
 *         content: 'This is a comment'
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retrieve all comments
 *     tags: [PostComment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostComment'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", authMiddleware, PostCommentController.get.bind(PostCommentController));
/**
 * @swagger
 * /comments/:id:
 *   get:
 *     summary: Retrieve comments by postID
 *     tags: [PostComment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: array of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/PostComment'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", authMiddleware, PostCommentController.get.bind(PostCommentController));

/**
 * @swagger
 * /comments/:
 *   post:
 *     summary: uploads a comment
 *     tags: [PostComment]
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                  properties:
 *                      postId:
 *                          type: string
 *                      content:
 *                          type: string
 *                  example:
 *                      postId: XXX
 *                      content: 'This is a comment'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: array of comments
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/FullPostComment'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authMiddleware, PostCommentController.post.bind(PostCommentController));

/**
 * @swagger
 * /comments/:
 *   put:
 *     summary: edit a comment
 *     tags: [PostComment]
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                  properties:
 *                      content:
 *                          type: string
 *                  example:
 *                      content: 'This is a comment'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: update successful
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/PostComment'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/", authMiddleware, PostCommentController.put.bind(PostCommentController));

/**
 * @swagger
 * /comments/:
 *   delete:
 *     summary: delete comment
 *     tags: [PostComment]
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                  properties:
 *                      type: string
 *                      description: id
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: deletion successful
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/FullPostComment'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/", authMiddleware, PostCommentController.delete.bind(PostCommentController));

export default router;