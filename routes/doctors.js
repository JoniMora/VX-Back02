const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const doctorController = require('../controllers/doctorController')

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the doctor.
 *         specialtyID:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Name of the doctor's specialty.
 *         appointment:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: List of appointment IDs associated with the doctor.
*/

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns all doctors, including details of the specialty and associated appointments.
 *     tags: [Doctors]
 *     responses:
 *       '200':
 *         description: Successfully retrieved doctors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *       '500':
 *         description: Server error. Check the logs for more details.
*/
router.get('/doctors', doctorController.getAllDoctors)

/**
 * @swagger
 * /doctor/{id}:
 *   get:
 *     summary: Get details of a doctor
 *     description: Returns details of a specific doctor, including specialty and available appointments.
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the doctor.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Successfully retrieved details of the doctor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       '404':
 *         description: Doctor not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the doctor was not found.
 *       '500':
 *         description: Server error. Check the logs for more details.
*/
router.get('/doctor/:id', doctorController.getDoctorDetails)

/**
 * @swagger
 * /doctor:
 *   post:
 *     summary: Add a new doctor
 *     description: Adds a new doctor. Authentication with an administrator's token is required.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  # Authentication token is required
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación del admin.
 *         schema:
 *           type: string
 *           format: JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the new doctor.
 *                 example: Dr. Smith
 *               specialtyID:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the specialty of the new doctor.
 *                 example: 657b6b284e782b8c8f2123a1
 *     responses:
 *       '200':
 *         description: Doctor successfully added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 message:
 *                   type: string
 *                   description: Informational message.
 *       '401':
 *         description: Unauthorized. An administrator's authentication token is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating lack of authorization.
 *       '500':
 *         description: Server error. Check the logs for more details.
*/
router.post('/doctor', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.addDoctor)

/**
 * @swagger
 * /doctor/{id}:
 *   put:
 *     summary: Update information of a doctor
 *     description: Updates the information of an existing doctor. Authentication with an administrator's token is required.
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []  # Authentication token is required
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the doctor.
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación del admin.
 *         schema:
 *           type: string
 *           format: JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the doctor.
 *                 example: Dr. Johnson
 *     responses:
 *       '200':
 *         description: Doctor's information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 message:
 *                   type: string
 *                   description: Informational message.
 *       '401':
 *         description: Unauthorized. An administrator's authentication token is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating lack of authorization.
 *       '404':
 *         description: Doctor not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the doctor was not found.
 *       '500':
 *         description: Server error. Check the logs for more details.
*/
router.put('/doctor/:id', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.updateDoctor)

module.exports = router