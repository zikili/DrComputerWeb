import express from "express";
const router = express.Router();
import PostController from "../controllers/post_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: The Posts API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *       bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Error:
 *          type: object
 *          required:
 *              - error
 *          properties:
 *              error:
 *                  type: string
 *          example:
 *              error: 'An error occurred during authentication.'
 *
 *      PostComment:
 *          type: object
 *          required:
 *              - owner
 *              - content
 *          properties:
 *              owner:
 *                  type: string
 *                  description: The user id
 *              content:
 *                  type: string
 *                  description: The comment content
 *          example:
 *              owner: '123'
 *              content: 'This is a comment'
 *
 *      Post:
 *          type: object
 *          required:
 *              - type
 *              - gpu
 *              - cpu
 *              - motherboard
 *              - memory
 *              - ram
 *              - image
 *              - comments
 *          properties:
 *              _id:
 *                  type: string
 *                  description: The post id
 *              owner:
 *                  type: string
 *                  description: The post creator
 *              type:
 *                  type: string
 *                  description: The computer type
 *              gpu:
 *                  type: string
 *                  description: The gpu name
 *              cpu:
 *                  type: string
 *                  description: The cpu name
 *              motherboard:
 *                  type: string
 *                  description: The motherboard name
 *              memory:
 *                  type: string
 *                  description: The memory name
 *              ram:
 *                  type: string
 *                  description: The ram name
 *              image:
 *                  type: string
 *                  description: The post image
 *              comments:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/PostComment'
 *          example:
 *              type: 'gaming'
 *              gpu: 'asus'
 *              cpu: 'intel'
 *              motherboard: 'asus'
 *              memory: 'kingston'
 *              ram: 'ram'
 *              image: 'image'
 *              comments: []
 */



router.get("/getMyPosts", authMiddleware, PostController.getMyPosts.bind(PostController))


/**
 * @swagger
*  /get: 
*   get:
*       summary: get post/s
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: returns post array
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Post'
*/

router.get("/", authMiddleware, PostController.get.bind(PostController));
router.get("/:id", authMiddleware, PostController.get.bind(PostController));

/**
 * @swagger
 * /post:
 *  post:
 *      summary: Creates a new post
 *      tags: [Posts]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Post'
 *      responses:
 *          200:
 *              description: The new post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 *          403:
 *              description: Wrong token used
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 *          401:
 *              description: No token provided
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Error'
 */

router.post("/", authMiddleware, PostController.post.bind(PostController));

//put
router.put("/", authMiddleware, PostController.put.bind(PostController));

//delete
router.delete("/", authMiddleware, PostController.delete.bind(PostController));

export default router;
