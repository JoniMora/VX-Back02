const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const emailService = require('../services/emailService')

const saltRounds = 8

exports.register = async (req, res) => {
    console.log(req.body)
    try {
        const { email, password, role } = req.body
    
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' })
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds)
    
        const newUser = new User({ email, password: hashedPassword, role })
        await newUser.save()
    
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, 'firmaTokenVX', { expiresIn: '1h' })
    
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
  
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
  
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' })
        }
    
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' })
        }
    
        const token = jwt.sign({ userId: user._id, role: user.role }, 'firmaTokenVX', { expiresIn: '1h' })
    
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
        }

        const recoveryToken = uuidv4()

        user.passwordRecoveryToken = recoveryToken
        await user.save()

        const recoveryLink = `https://dominioDevMora.com/reset-password/${recoveryToken}`
        
        await emailService.sendPasswordRecoveryEmail(user.email, recoveryLink)
        
        res.status(200).json({ success: true, message: 'Correo electrónico de recuperación enviado' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error en el servidor' })
    }
}