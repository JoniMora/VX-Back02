const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const appointmentController = require('../controllers/appointmentController')

router.post('/appointment', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.createAppointment)
router.put('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.updateAppointment)
router.delete('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.deleteAppointment)

router.get('/appointments', appointmentController.getAllAppointments)
router.get('/appointment/doctor/:did', appointmentController.getAppointmentsByDoctor)

router.post('/appointment/:aid/reserve', authMiddleware.authMiddleware, authMiddleware.isPatient, appointmentController.reserveAppointment)

module.exports = router