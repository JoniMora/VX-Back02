const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const doctorController = require('../controllers/doctorController')

router.get('/doctors', doctorController.getAllDoctors)
router.get('/doctor/:id', doctorController.getDoctorDetails)
router.post('/doctor', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.addDoctor)
router.put('/doctor/:id', authMiddleware.authMiddleware, authMiddleware.isAdmin, doctorController.updateDoctor)

module.exports = router