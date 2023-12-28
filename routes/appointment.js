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
 *           description: Identificador único de la cita.
 *         doctor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Identificador único del doctor asociado a la cita.
 *             name:
 *               type: string
 *               description: Nombre del doctor.
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha de la cita.
 *         time:
 *           type: string
 *           description: Hora de la cita.
 *         available:
 *           type: boolean
 *           description: Indica si la cita está disponible.
 *         patient:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: Identificador único del paciente asociado a la cita.
 *             name:
 *               type: string
 *               description: Nombre del paciente.
 *         cancellationHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cancellationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de la cancelación.
 *               canceledByPatient:
 *                 type: string
 *                 description: Identificador único del paciente que canceló la cita.
 *               canceledAppointmentTime:
 *                 type: string
 *                 description: Hora de la cita cancelada.
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
 *           description: Fecha y hora de la cancelación.
 *         canceledByPatient:
 *           type: string
 *           description: Identificador único del paciente que canceló la cita.
 *         canceledAppointmentTime:
 *           type: string
 *           description: Hora de la cita cancelada en formato 'HH:mm'.
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Crear una nueva cita
 *     description: Crea una nueva cita en el sistema. Se requiere autenticación de administrador.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Usa el token de autenticación (Admin) como parte del encabezado 
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
 *               doctorID:
 *                 type: string
 *                 description: Identificador único del doctor asociado a la cita.
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita en formato 'YYYY-MM-DD'.
 *               time:
 *                 type: string
 *                 description: Hora de la cita en formato 'HH:mm'.
 *               patientID:
 *                 type: string
 *                 description: (Opcional) Identificador único del paciente asociado a la cita si está reservada.
 *     responses:
 *       '201':
 *         description: Cita creada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 appointment:
 *                   type: object
 *                   properties:
 *                     doctor:
 *                       type: string
 *                       description: Identificador único del doctor asociado a la cita.
 *                     date:
 *                       type: string
 *                       description: Fecha de la cita en formato 'YYYY-MM-DD'.
 *                     time:
 *                       type: string
 *                       description: Hora de la cita en formato 'HH:mm'.
 *                     available:
 *                       type: boolean
 *                       description: Indica si la cita está disponible.
 *                     _id:
 *                       type: string
 *                       description: Identificador único de la cita.
 *                     cancellationHistory:
 *                       type: array
 *                       items: []
 *       '400':
 *         description: Error en la solicitud. Verifica los detalles en el mensaje de error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '401':
 *         description: No autorizado. Se requiere un token de administrador válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.post('/appointment', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.createAppointment)

/**
 * @swagger
 * /appointment/{aid}:
 *   put:
 *     summary: Actualizar una cita existente
 *     description: Actualiza los detalles de una cita existente en el sistema. Se requiere autenticación de administrador.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Usa el token de autenticación (Admin) como parte del encabezado
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Identificador único de la cita que se actualizará.
 *         schema:
 *           type: string
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
 *               newDate:
 *                 type: string
 *                 format: date
 *                 description: (Opcional) Nueva fecha de la cita en formato 'YYYY-MM-DD'.
 *               newTime:
 *                 type: string
 *                 description: (Opcional) Nueva hora de la cita en formato 'HH:mm'.
 *     responses:
 *       '200':
 *         description: Cita actualizada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 appointment:
 *                   $ref: '#/components/schemas/Appointment'
 *       '400':
 *         description: Error en la solicitud. Verifica los detalles en el mensaje de error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *                 details:
 *                   type: object
 *                   description: Detalles adicionales sobre el error (si los hay).
 *       '401':
 *         description: No autorizado. Se requiere un token de administrador válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '404':
 *         description: Cita no encontrada. Verifica el identificador de la cita.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *                 details:
 *                   type: object
 *                   description: Detalles adicionales sobre el error (si los hay).
*/
router.put('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.updateAppointment)

/**
 * @swagger
 * /appointment/{aid}:
 *   delete:
 *     summary: Eliminar una cita existente
 *     description: Elimina una cita existente del sistema. Se requiere autenticación de administrador.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Usa el token de autenticación (Admin) como parte del encabezado
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Identificador único de la cita que se eliminará.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación del admin.
 *         schema:
 *           type: string
 *           format: JWT
 *     responses:
 *       '200':
 *         description: Cita eliminada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 message:
 *                   type: string
 *                   description: Mensaje informativo sobre la eliminación exitosa.
 *       '400':
 *         description: Error en la solicitud. Verifica los detalles en el mensaje de error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '401':
 *         description: No autorizado. Se requiere un token de administrador válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '404':
 *         description: Cita no encontrada. Verifica el identificador de la cita.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.delete('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.deleteAppointment)

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Obtener todas las citas
 *     description: Obtiene la lista de todas las citas en el sistema.
 *     tags: [Appointments]
 *     responses:
 *       '200':
 *         description: Lista de citas obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 data:
 *                   type: array
 *                   description: Lista de citas.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Identificador único de la cita.
 *                       doctor:
 *                         type: string
 *                         description: Identificador único del doctor asociado a la cita.
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Fecha de la cita.
 *                       time:
 *                         type: string
 *                         description: Hora de la cita.
 *                       available:
 *                         type: boolean
 *                         description: Indica si la cita está disponible.
 *                       cancellationHistory:
 *                         type: array
 *                         description: Historial de cancelaciones de la cita.
 *                         items:
 *                           $ref: '#/components/schemas/CancellationHistory'
 *                       patient:
 *                         type: string
 *                         description: Identificador único del paciente asociado a la cita.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.get('/appointments', appointmentController.getAllAppointments)

/**
 * @swagger
 * /appointment/doctor/{did}:
 *   get:
 *     summary: Obtener citas por doctor
 *     description: Obtiene la lista de citas asociadas a un doctor específico.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: did
 *         required: true
 *         description: Identificador único del doctor.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de citas obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 data:
 *                   type: array
 *                   description: Lista de citas asociadas al doctor.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Identificador único de la cita.
 *                       doctor:
 *                         type: string
 *                         description: Identificador único del doctor asociado a la cita.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora de la cita.
 *                       time:
 *                         type: string
 *                         description: Hora de la cita en formato 'HH:mm'.
 *                       available:
 *                         type: boolean
 *                         description: Indica si la cita está disponible.
 *                       cancellationHistory:
 *                         type: array
 *                         description: Historial de cancelaciones de la cita.
 *                         items:
 *                           $ref: '#/components/schemas/CancellationHistory'
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.get('/appointment/doctor/:did', appointmentController.getAppointmentsByDoctor)

/**
 * @swagger
 * /appointment/patient/{pid}:
 *   get:
 *     summary: Obtener citas por paciente
 *     description: Obtiene la lista de citas asociadas a un paciente específico.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Identificador único del paciente.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de citas obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 data:
 *                   type: array
 *                   description: Lista de citas asociadas al paciente.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Identificador único de la cita.
 *                       doctor:
 *                         type: string
 *                         description: Identificador único del doctor asociado a la cita.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha y hora de la cita.
 *                       time:
 *                         type: string
 *                         description: Hora de la cita en formato 'HH:mm'.
 *                       available:
 *                         type: boolean
 *                         description: Indica si la cita está disponible.
 *                       cancellationHistory:
 *                         type: array
 *                         description: Historial de cancelaciones de la cita.
 *                         items:
 *                           $ref: '#/components/schemas/CancellationHistory'
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.get('/appointment/patient/:pid', appointmentController.getAppointmentsByPatient)

/**
 * @swagger
 * /appointment/{aid}/reserve:
 *   post:
 *     summary: Reservar cita
 *     description: Reserva una cita específica para un paciente.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []  # Usa el token de autenticación (paciente) como parte del encabezado
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Identificador único de la cita a reservar.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación del paciente.
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
 *                 description: Identificador único del paciente que reserva la cita.
 *     responses:
 *       '200':
 *         description: Cita reservada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 message:
 *                   type: string
 *                   description: Mensaje informativo sobre la reserva de la cita.
 *       '400':
 *         description: Solicitud incorrecta. Comprueba los detalles del error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '401':
 *         description: No autorizado. Se requiere un token de autenticación válido para pacientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.post('/appointment/:aid/reserve', authMiddleware.authMiddleware, authMiddleware.isPatient, appointmentController.reserveAppointment)

/**
 * @swagger
 * /appointment/{aid}/cancel:
 *   post:
 *     summary: Cancelar cita
 *     description: Cancela una cita específica reservada por un paciente.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Identificador único de la cita a cancelar.
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token de autenticación del paciente.
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
 *                 description: Identificador único del paciente que cancela la cita.
 *     responses:
 *       '200':
 *         description: Cita cancelada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 message:
 *                   type: string
 *                   description: Mensaje informativo sobre la cancelación de la cita.
 *       '400':
 *         description: Solicitud incorrecta. Comprueba los detalles del error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '401':
 *         description: No autorizado. Se requiere un token de autenticación válido para pacientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.post('/appointment/:aid/cancel', authMiddleware.authMiddleware, authMiddleware.isPatient, appointmentController.cancelAppointment)

/**
 * @swagger
 * /appointment/cancellation-history/{pid}:
 *   get:
 *     summary: Historial de cancelaciones de un paciente
 *     description: Obtiene el historial de cancelaciones de citas de un paciente.
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Identificador único del paciente.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Historial de cancelaciones obtenido con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 cancellationHistory:
 *                   type: array
 *                   description: Lista de cancelaciones del paciente.
 *                   items:
 *                     $ref: '#/components/schemas/CancellationHistory'
 *       '404':
 *         description: No se encontró historial de cancelaciones para el paciente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 message:
 *                   type: string
 *                   description: Mensaje informativo sobre la falta de historial de cancelaciones.
 *       '500':
 *         description: Error del servidor. Consulta los logs para más detalles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indica si la solicitud fue exitosa.
 *                 error:
 *                   type: string
 *                   description: Descripción detallada del error.
*/
router.get('/appointment/cancellation-history/:pid', appointmentController.getCancellationHistoryByPatient)

module.exports = router