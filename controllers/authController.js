const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailService = require('../services/emailService')

const saltRounds = 8

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body
    
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado.' })
        }
    
        const hashedPassword = await bcrypt.hash(password, saltRounds)
    
        const newUser = new User({ email, password: hashedPassword, role })
        await newUser.save()
    
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, 'tu_secreto_secreto', { expiresIn: '1h' })
    
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}


exports.login = async (req, res) => {
  // logica de inicio de session
}

exports.forgotPassword = async (req, res) => {
  // logica de recuperacion de pass
}