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
 *         appointments:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: List of appointment IDs associated with the doctor.
 *       required:
 *         - name
 *         - specialtyID
*/

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns all doctors, including details of the specialty and associated appointments.
 *     tags: [Doctor]
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
 *               example:
 *                 success: true
 *                 data:
 *                   - _id: "6589babbebd7746b357f29b4"
 *                     name: "Dr. Smith"
 *                     specialtyID:
 *                       _id: "657b5e06deedbb22b3455c96"
 *                       name: "Cardiology"
 *                     appointments: []
 *                   - _id: "6589bac1ebd7746b357f29b6"
 *                     name: "Dr. Johnson"
 *                     specialtyID:
 *                       _id: "657b6b284e782b8c8f2123a1"
 *                       name: "Dermatology"
 *                     appointments: []
 *       '500':
 *         description: Server error. Check the logs for more details.
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
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.get('/doctors', doctorController.getAllDoctors)

/**
 * @swagger
 * /doctor/{id}:
 *   get:
 *     summary: Get details of a doctor
 *     description: Returns details of a specific doctor, including specialty and available appointments.
 *     tags: [Doctor]
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
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Unique identifier for the doctor.
 *                     name:
 *                       type: string
 *                       description: Name of the doctor.
 *                     specialtyID:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: Unique identifier for the specialty.
 *                         name:
 *                           type: string
 *                           description: Name of the doctor's specialty.
 *                     appointments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Unique identifier for the appointment.
 *                           doctor:
 *                             type: string
 *                             description: ID of the doctor associated with the appointment.
 *                           date:
 *                             type: string
 *                             format: date
 *                             description: Date of the appointment.
 *                           time:
 *                             type: string
 *                             description: Time of the appointment.
 *                           available:
 *                             type: boolean
 *                             description: Indicates if the appointment is available.
 *                           cancellationHistory:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 cancellationDate:
 *                                   type: string
 *                                   format: date-time
 *                                   description: Date and time when the appointment was canceled.
 *                                 canceledByPatient:
 *                                   type: string
 *                                   description: ID of the patient who canceled the appointment.
 *                                 canceledAppointmentTime:
 *                                   type: string
 *                                   description: Time of the canceled appointment.
 *                                 _id:
 *                                   type: string
 *                                   description: Unique identifier for the cancellation record.
 *                           patient:
 *                             type: string
 *                             description: ID of the patient associated with the appointment (or null if not assigned).
 *               example:
 *                 success: true
 *                 data:
 *                   _id: "6589babbebd7746b357f29b4"
 *                   name: "Dr. Smith"
 *                   specialtyID:
 *                     _id: "657b5e06deedbb22b3455c96"
 *                     name: "Cardiology"
 *                   appointments:
 *                     - _id: "658a461c71e73476e218b050"
 *                       doctor: "6589babbebd7746b357f29b4"
 *                       date: "2023-12-26"
 *                       time: "10:00"
 *                       available: true
 *                       cancellationHistory:
 *                         - cancellationDate: "2023-12-26T03:23:50.311Z"
 *                           canceledByPatient: "6588be7d8fa4b851e4165d47"
 *                           canceledAppointmentTime: "10:00"
 *                           _id: "658a474671e73476e218b069"
 *                         - cancellationDate: "2023-12-26T03:24:04.308Z"
 *                           canceledByPatient: "6588be7d8fa4b851e4165d47"
 *                           canceledAppointmentTime: "10:00"
 *                           _id: "658a475471e73476e218b072"
 *                       patient: null
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
 *               example:
 *                 success: false
 *                 error: "Doctor not found."
 *       '500':
 *         description: Server error. Check the logs for more details.
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
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.get('/doctor/:id', doctorController.getDoctorDetails)

/**
 * @swagger
 * /doctor:
 *   post:
 *     summary: Add a new doctor
 *     description: Adds a new doctor. Authentication with an administrator's token is required.
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []  # Authentication token is required
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Administrator's authentication token.
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
 *               example:
 *                 success: true
 *                 message: "Doctor successfully added."
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
 *               example:
 *                 success: false
 *                 error: "Unauthorized. Administrator's token required."
 *       '500':
 *         description: Server error. Check the logs for more details.
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
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.post('/doctor', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.addDoctor)

/**
 * @swagger
 * /doctor/{id}:
 *   put:
 *     summary: Update information of a doctor
 *     description: Updates the information of an existing doctor. Authentication with an administrator's token is required.
 *     tags: [Doctor]
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
 *         description: Administrator's authentication token.
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
 *               example:
 *                 success: true
 *                 message: "Doctor's information updated successfully."
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
 *               example:
 *                 success: false
 *                 error: "Unauthorized. Administrator's token required."
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
 *               example:
 *                 success: false
 *                 error: "Doctor not found."
 *       '500':
 *         description: Server error. Check the logs for more details.
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
 *                   description: Error message indicating the reason for the failure.
 *               example:
 *                 success: false
 *                 error: "Internal server error."
*/
router.put('/doctor/:id', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.updateDoctor)

module.exports = router