const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const appointmentController = require('../controllers/appointmentController')

router.post('/appointment', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.createAppointment)
router.put('/appointment/:aid', authMiddleware.authMiddleware, authMiddleware.isAdmin, appointmentController.updateAppointment)

module.exports = router