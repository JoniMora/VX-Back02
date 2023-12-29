const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const limiter = require('../middlewares/authMiddleware')
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address.
 *         password:
 *           type: string
 *           description: User password.
 *         role:
 *           type: string
 *           enum: [patient]
 *           description: Role of the user (patient).
 *       required:
 *         - email
 *         - password
 *         - role
*/

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User register
 *     description: Register a new user as a patient.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *             role: "patient"
 *     responses:
 *       '200':
 *         description: Registered user successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for user authentication.
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       '400':
 *         description: Bad Request. Check the required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Missing required fields."
 *       '500':
 *         description: Server error. Check the logs for more details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.post('/register', authController.register)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     description: Log in using user credentials.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The registered user's email address.
 *               password:
 *                 type: string
 *                 description: The password of the registered user.
 *             required:
 *               - email
 *               - password
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       '200':
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for user authentication.
 *               example:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       '401':
 *         description: Invalid credentials. Please check the email and password. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate whether the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating invalid credentials.
 *               example:
 *                 success: false
 *                 error: "Invalid email or password."
 *       '500':
 *         description: Server error. Check the logs for more details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate whether the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.post('/login', authController.login)

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request Password Reset
 *     description: Sends an email with a link to reset the user's password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the registered user.
 *             required:
 *               - email
 *           example:
 *             email: "user@example.com"
 *     responses:
 *       '200':
 *         description: Password recovery email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 message:
 *                   type: string
 *                   description: Informational message.
 *               example:
 *                 success: true
 *                 message: "Password recovery email sent successfully. Please check your inbox."
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user was not found.
 *               example:
 *                 success: false
 *                 error: "User not found."
 *       '500':
 *         description: Server error. Check the logs for more details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.post('/forgot-password', authController.forgotPassword)

/**
 * @swagger
 * /reset-password/{recoveryToken}:
 *   post:
 *     summary: Reset Password
 *     description: Resets the user's password using the recovery token.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: recoveryToken
 *         required: true
 *         description: Password recovery token received via email.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user.
 *             required:
 *               - newPassword
 *           example:
 *             newPassword: "newPassword123"
 *     responses:
 *       '200':
 *         description: Password reset successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 message:
 *                   type: string
 *                   description: Informational message.
 *               example:
 *                 success: true
 *                 message: "Password reset successful."
 *       '404':
 *         description: Recovery token not found or already used.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the recovery token was not found or has already been used.
 *               example:
 *                 success: false
 *                 error: "Recovery token not found or already used."
 *       '400':
 *         description: Expired recovery token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the recovery token has expired.
 *               example:
 *                 success: false
 *                 error: "Expired recovery token."
 *       '500':
 *         description: Server error. Check the logs for more details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicate if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.post('/reset-password/:recoveryToken', authController.resetPassword)

module.exports = router