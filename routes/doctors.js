const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const doctorController = require('../controllers/doctorController')

router.get('/doctors', doctorController.getAllDoctors)

router.get('/doctors/:id', doctorController.getDoctorDetails)

router.post('/doctors', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.addDoctor)

router.put('/doctors/:id', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.updateDoctor)

module.exports = router


// Médicos
// - Listar todos los médicos registrados en el sistema
// - Mostrar el detalle de un médico incluyendo sus turnos disponibles
// - Agregar un nuevo médico al sistema (solo disponible como admin)
//- Actualizar información de un médico en el sistema (solo disponible como admin)
