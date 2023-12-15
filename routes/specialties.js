const express = require('express')
const router = express.Router()
const specialtyController = require('../controllers/specialtyController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/specialties', specialtyController.getAllSpecialties)
router.post('/specialties', authMiddleware.authMiddleware, authMiddleware.isAdmin, specialtyController.createSpecialty)

module.exports = router