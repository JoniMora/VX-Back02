const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:recoveryToken', authController.resetPassword)

// router.get('/protected-router', authMiddleware.authMiddleware, (req, res) => { //solo accede si el middleware verifica los tokens
//     res.json({ message: '¡Esta es una ruta protegida!' })
// })

module.exports = router