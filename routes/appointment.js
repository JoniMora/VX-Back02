const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const appointmentController = require('../controllers/appointmentController')

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the appointment.
 *         doctor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Unique identifier of the doctor associated with the appointment.
 *             name:
 *               type: string
 *               description: Name of the doctor.
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the appointment.
 *         time:
 *           type: string
 *           description: Time of the appointment.
 *         available:
 *           type: boolean
 *           description: Indicates if the appointment is available.
 *         patient:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Unique identifier of the patient associated with the appointment.
 *             name:
 *               type: string
 *               description: Name of the patient.
 *         cancellationHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cancellationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the cancellation.
 *               canceledByPatient:
 *                 type: string
 *                 description: Unique identifier of the patient who canceled the appointment.
 *               canceledAppointmentTime:
 *                 type: string
 *                 description: Time of the canceled appointment.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CancellationHistory:
 *       type: object
 *       properties:
 *         cancellationDate:
 *           type: string
 *           format: date-time
 *           description: Date and time of the cancellation.
 *         canceledByPatient:
 *           type: string
 *           description: Unique identifier of the patient who canceled the appointment.
 *         canceledAppointmentTime:
 *           type: string
 *           description: Time of the canceled appointment in 'HH:mm' format.
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     description: Creates a new appointment in the system. Administrator authentication is required.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Uses the authentication token (Admin) as part of the header
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Admin authentication token.
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
 *               doctorID:
 *                 type: string
 *                 description: Unique identifier of the doctor associated with the appointment.
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the appointment in 'YYYY-MM-DD' format.
 *               time:
 *                 type: string
 *                 description: Time of the appointment in 'HH:mm' format.
 *               patientID:
 *                 type: string
 *                 description: (Optional) Unique identifier of the patient associated with the appointment if it's reserved.
 *     responses:
 *       '201':
 *         description: Appointment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     doctor:
 *                       type: string
 *                       description: Unique identifier of the doctor associated with the appointment.
 *                     date:
 *                       type: string
 *                       description: Date of the appointment in 'YYYY-MM-DD' format.
 *                     time:
 *                       type: string
 *                       description: Time of the appointment in 'HH:mm' format.
 *                     available:
 *                       type: boolean
 *                       description: Indicates if the appointment is available.
 *                     _id:
 *                       type: string
 *                       description: Unique identifier of the appointment.
 *                     cancellationHistory:
 *                       type: array
 *                       items: []
 *       '400':
 *         description: Request error. Check the details in the error message.
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
 *                   description: Detailed error description.
 *       '401':
 *         description: Unauthorized. A valid administrator token is required.
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
 *                   description: Detailed error description.
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
 *                   description: Detailed error description.
*/
router.post('/appointment', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.createAppointment)

/**
 * @swagger
 * /appointment/{aid}:
 *   put:
 *     summary: Update an existing appointment
 *     description: Updates the details of an existing appointment in the system. Administrator authentication is required.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Uses the authentication token (Admin) as part of the header
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Unique identifier of the appointment to be updated.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Admin authentication token.
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
 *               newDate:
 *                 type: string
 *                 format: date
 *                 description: (Optional) New date of the appointment in 'YYYY-MM-DD' format.
 *               newTime:
 *                 type: string
 *                 description: (Optional) New time of the appointment in 'HH:mm' format.
 *     responses:
 *       '200':
 *         description: Appointment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       '400':
 *         description: Request error. Check the details in the error message.
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
 *                   description: Detailed error description.
 *                 details:
 *                   type: object
 *                   description: Additional details about the error (if any).
 *       '401':
 *         description: Unauthorized. A valid administrator token is required.
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
 *                   description: Detailed error description.
 *       '404':
 *         description: Appointment not found. Check the appointment identifier.
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
 *                   description: Detailed error description.
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
 *                   description: Detailed error description.
 *                 details:
 *                   type: object
 *                   description: Additional details about the error (if any).
*/
router.put('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.updateAppointment)

/**
 * @swagger
 * /appointment/{aid}:
 *   delete:
 *     summary: Delete an existing appointment
 *     description: Deletes an existing appointment from the system. Administrator authentication is required.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Uses the authentication token (Admin) as part of the header
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Unique identifier of the appointment to be deleted.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Admin authentication token.
 *         schema:
 *           type: string
 *           format: JWT
 *     responses:
 *       '200':
 *         description: Appointment deleted successfully.
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
 *                   description: Informative message about the successful deletion.
 *       '400':
 *         description: Request error. Check the details in the error message.
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
 *                   description: Detailed error description.
 *       '401':
 *         description: Unauthorized. A valid administrator token is required.
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
 *                   description: Detailed error description.
 *       '404':
 *         description: Appointment not found. Check the appointment identifier.
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
 *                   description: Detailed error description.
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
 *                   description: Detailed error description.
*/
router.delete('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.deleteAppointment)

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Retrieves the list of all appointments in the system.
 *     tags: [Appointments]
 *     responses:
 *       '200':
 *         description: List of appointments successfully obtained.
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
 *                   description: List of appointments.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the appointment.
 *                       doctor:
 *                         type: string
 *                         description: Unique identifier of the doctor associated with the appointment.
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Date of the appointment.
 *                       time:
 *                         type: string
 *                         description: Time of the appointment.
 *                       available:
 *                         type: boolean
 *                         description: Indicates if the appointment is available.
 *                       cancellationHistory:
 *                         type: array
 *                         description: Cancellation history of the appointment.
 *                         items:
 *                           $ref: '#/components/schemas/CancellationHistory'
 *                       patient:
 *                         type: string
 *                         description: Unique identifier of the patient associated with the appointment.
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
 *                   description: Detailed error description.
*/
router.get('/appointments', appointmentController.getAllAppointments)

/**
 * @swagger
 * /appointment/doctor/{did}:
 *   get:
 *     summary: Get appointments by doctor
 *     description: Retrieves the list of appointments associated with a specific doctor.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Unique identifier of the doctor.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of appointments successfully obtained.
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
 *                   description: List of appointments associated with the doctor.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the appointment.
 *                       doctor:
 *                         type: string
 *                         description: Unique identifier of the doctor associated with the appointment.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time of the appointment.
 *                       time:
 *                         type: string
 *                         description: Time of the appointment in 'HH:mm' format.
 *                       available:
 *                         type: boolean
 *                         description: Indicates if the appointment is available.
 *                       cancellationHistory:
 *                         type: array
 *                         description: Cancellation history of the appointment.
 *                         items:
 *                           $ref: '#/components/schemas/CancellationHistory'
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
 *                   description: Detailed error description.
*/
router.get('/appointment/doctor/:did', appointmentController.getAppointmentsByDoctor)

/**
 * @swagger
 * /appointment/patient/{pid}:
 *   get:
 *     summary: Get appointments by patient
 *     description: Retrieves the list of appointments associated with a specific patient.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Unique identifier of the patient.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of appointments successfully obtained.
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
 *                   description: List of appointments associated with the patient.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier of the appointment.
 *                       doctor:
 *                         type: string
 *                         description: Unique identifier of the doctor associated with the appointment.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time of the appointment.
 *                       time:
 *                         type: string
 *                         description: Time of the appointment in 'HH:mm' format.
 *                       available:
 *                         type: boolean
 *                         description: Indicates if the appointment is available.
 *                       cancellationHistory:
 *                         type: array
 *                         description: Cancellation history of the appointment.
 *                         items:
 *                           $ref: '#/components/schemas/CancellationHistory'
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
 *                   description: Detailed error description.
*/
router.get('/appointment/patient/:pid', appointmentController.getAppointmentsByPatient)

/**
 * @swagger
 * /appointment/{aid}/reserve:
 *   post:
 *     summary: Reserve appointment
 *     description: Reserves a specific appointment for a patient.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Uses patient authentication token as part of the header
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Unique identifier of the appointment to be reserved.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Patient's authentication token.
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
 *               patientID:
 *                 type: string
 *                 description: Unique identifier of the patient reserving the appointment.
 *     responses:
 *       '200':
 *         description: Appointment successfully reserved.
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
 *                   description: Informational message about the appointment reservation.
 *       '400':
 *         description: Bad request. Check the error details.
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
 *                   description: Detailed error description.
 *       '401':
 *         description: Unauthorized. A valid patient authentication token is required.
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
 *                   description: Detailed error description.
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
 *                   description: Detailed error description.
*/
router.post('/appointment/:aid/reserve', authMiddleware.authMiddleware, authMiddleware.isPatient, appointmentController.reserveAppointment)

/**
 * @swagger
 * /appointment/{aid}/cancel:
 *   post:
 *     summary: Cancel appointment
 *     description: Cancels a specific appointment reserved by a patient.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Unique identifier of the appointment to cancel.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Patient's authentication token.
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
 *               patientID:
 *                 type: string
 *                 description: Unique identifier of the patient canceling the appointment.
 *     responses:
 *       '200':
 *         description: Appointment canceled successfully.
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
 *                   description: Informational message about the appointment cancellation.
 *       '400':
 *         description: Bad request. Check the error details.
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
 *                   description: Detailed error description.
 *       '401':
 *         description: Unauthorized. A valid patient authentication token is required.
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
 *                   description: Detailed error description.
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
 *                   description: Detailed error description.
*/
router.post('/appointment/:aid/cancel', authMiddleware.authMiddleware, authMiddleware.isPatient, appointmentController.cancelAppointment)

/**
 * @swagger
 * /appointment/cancellation-history/{pid}:
 *   get:
 *     summary: Patient's Cancellation History
 *     description: Retrieves the cancellation history of appointments for a specific patient.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Unique identifier of the patient.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Cancellation history retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *                 cancellationHistory:
 *                   type: array
 *                   description: List of cancellations for the patient.
 *                   items:
 *                     $ref: '#/components/schemas/CancellationHistory'
 *       '404':
 *         description: Cancellation history not found for the patient.
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
 *                   description: Informational message about the lack of cancellation history.
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
 *                   description: Detailed error description.
*/
router.get('/appointment/cancellation-history/:pid', appointmentController.getCancellationHistoryByPatient)

module.exports = router