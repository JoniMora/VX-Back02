const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const limiter = require('../middlewares/authMiddleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:recoveryToken', authController.resetPassword)

module.exports = router