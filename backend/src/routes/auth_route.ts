import express from "express";
const router = express.Router();
import AuthController, { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: The Authentication API
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
 *      User:
 *          type: object
 *          required:
 *              - email
 *              - username
 *              - image
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The user email
 *              password:
 *                  type: string
 *                  description: The user password
 *              username:
 *                  type: string
 *                  description: The user name
 *              image:
 *                  type: string
 *                  description: The user image
 *          example:
 *              email: 'bob@gmail.com'
 *              password: '123456'
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: registers a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: The new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.post("/register", AuthController.register);
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
 *     Profile:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - image
 *       properties:
 *         username:
 *           type: string
 *           description: The user name
 *         image:
 *           type: string
 *           description: The user image
 *         email:
 *           type: string
 *           description: The user email
 *       example:
 *         username: 'XXX'
 *         email: 'XX@XX.COM'
 *         image: 'https://example.com/bob.jpg'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *       summary: registers a new user
 *       tags: [Auth]
 *       requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/User'
 *       responses:
 *           200:
 *               description: The acess & refresh tokens
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Tokens'
 */

router.post("/login", AuthController.login);
/**
 * @swagger
 * /auth/refreshToken:
 *   get:
 *       summary: get a new access token using the refresh token
 *       tags: [Auth]
 *       description: need to provide the refresh token in the auth header
 *       security:
 *           - bearerAuth: []
 *       responses:
 *           200:
 *               description: The access & refresh tokens
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Tokens'
 *           400:
 *               description: error occured during sign-in
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           401:
 *               description: user hacked
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           403:
 *               description: wrong token provided
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 */

router.get("/refresh", AuthController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *       summary: logout a user
 *       tags: [Auth]
 *       description: need to provide the refresh token in the auth header
 *       security:
 *       - bearerAuth: []
 *       responses:
 *           200:
 *               description: logout completed successfully
 *           400:
 *               description: error occured during log-out
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           401:
 *               description: user hacked
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 *           403:
 *               description: wrong token provided
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 */

router.get("/logout", AuthController.logout);

/**
 * @swagger
 * /auth/googleSignin:
 *   post:
 *       summary: login with google
 *       tags: [Auth]
 *       description: a google log in
 *       security:
 *       - bearerAuth: []
 *       responses:
 *           200:
 *               description: The access & refresh tokens
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Tokens'
 *           400:
 *               description: error occured during sign-in
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 */
router.post("/googleSignin", AuthController.googleSignin);

/**
 * @swagger
 * /auth/info:
 *   get:
 *       summary: get my profile
 *       tags: [Auth]
 *       description: returns a profile
 *       security:
 *       - bearerAuth: []
 *       responses:
 *           200:
 *               description: Profile items
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Profile'
 *           400:
 *               description: error occured during sign-in
 *               content:
 *                   application/json:
 *                       schema:
 *                           $ref: '#/components/schemas/Error'
 */
router.get("/info", authMiddleware, AuthController.getProfile);
/**
 * @swagger
 * /auth/update:
 *   put:
 *     summary: Update a user
 *     tags: [Auth]
 *     description: Updates a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 $ref: '#/components/schemas/Profile'
 *               password:
 *                 type: string
 *                 description: New user password
 *     responses:
 *       200:
 *         description: Profile items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *                 password:
 *                   type: string
 *                   description: New user password
 *       400:
 *         description: Error occurred during update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.put("/update", authMiddleware, AuthController.updateProfile);

export default router;
