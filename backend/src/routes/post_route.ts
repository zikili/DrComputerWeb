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


/**
 * @swagger
*  /get/getMyPosts: 
*   get:
*       summary: Get all of my posts
*       tags: [Posts]
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: returns post array
*               content:
*                   application/json:
*                       schema:
*                       type: array
*                       items:
*                           $ref: '#/components/schemas/Post'
*           403:
*              description: Wrong token used
*              content:
*                  application/json:
*                      schema:
*                          $ref: '#/components/schemas/Error'
*           500:
*               description: error in db
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Error'
*/
router.get("/getMyPosts", authMiddleware, PostController.getMyPosts.bind(PostController))


/**
 * @swagger
*  /get: 
*   get:
*       summary: get post/posts
*       tags: [Posts]
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: returns post array
*               content:
*                   application/json:
*                       schema:
*                       type: array
*                       items:
*                           $ref: '#/components/schemas/Post'
*           403:
*              description: Wrong token used
*              content:
*                  application/json:
*                      schema:
*                          $ref: '#/components/schemas/Error'
*           500:
*               description: error in db
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Error'
*/
router.get("/", authMiddleware, PostController.get.bind(PostController));
/**
 * @swagger
 * /get/:id:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
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
 *         description: Returns the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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

/**
 * @swagger
 * /post:
 *   put:
 *     summary: Updates an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: db error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.put("/", authMiddleware, PostController.put.bind(PostController));

/**
 * @swagger
 * /post:
 *   delete:
 *     summary: Deletes a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the post
 *       403:
 *         description: Wrong token used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: db error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.delete("/", authMiddleware, PostController.delete.bind(PostController));

export default router;
