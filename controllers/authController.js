const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const emailService = require('../services/emailService')
const validator = require('validator')
const { limiter } = require('../middlewares/authMiddleware')

const saltRounds = 8

exports.register = async (req, res) => {
    try {
        const {email, password, role} = req.body
        if (!email || !password || !role) {
            return res.status(400).json({success: false, error: 'Please provide all required fields.'})
        }
    
        if (!validator.isEmail(email)) {
            return res.status(400).json({success: false, error: 'Invalid email format.'})
        }
    
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({success: false, error: 'Email is already registered.'})
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds)
    
        const newUser = new User({email, password: hashedPassword, role})
        await newUser.save()
    
        const token = jwt.sign({userId: newUser._id, role: newUser.role}, process.env.JWT_SECRET, {expiresIn: '1h'})
    
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, error: 'Server error.'})
    }
}
  
exports.login = async (req, res) => {
    limiter(req, res, async () => {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(400).json({success: false, error: 'Please provide all required fields.'})
            }

            const user = await User.findOne({ email })
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({success: false, error: 'Invalid credentials.'})
            }
        
            const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'})
        
            res.json({ token })
        } catch (error) {
            console.error(error)
            res.status(500).json({success: false, error: 'Server error.'})
        }
    })
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found.'})
        }

        const recoveryToken = uuidv4()
        const expirationDate = new Date()
        expirationDate.setMinutes(expirationDate.getMinutes() + 5)

        user.passwordRecovery = {
            token: recoveryToken,
            expiration: expirationDate
        }

        await user.save()

        const recoveryLink = `https://dominioDevMora.com/reset-password/${recoveryToken}`

        await emailService.sendPasswordRecoveryEmail(user.email, recoveryLink)

        res.status(200).json({success: true, message: 'Recovery email sent.'})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Server error.'})
    }
}

exports.resetPassword = async (req, res) => {
    const { recoveryToken } = req.params
    const { newPassword } = req.body

    try {
        let user = await User.findOne({'passwordRecovery.token': recoveryToken})

        if (!user || user.passwordRecovery.used) {
            return res.status(404).json({success: false, message: 'Recovery token not found or already used.'})
        }

        if (user.passwordRecovery.expiration < new Date()) {
            return res.status(400).json({success: false, message: 'Recovery token has expired.'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        user.password = hashedPassword

        await User.updateOne(
            {_id: user._id},
            {$unset: {'passwordRecovery.token': 1, 'passwordRecovery.expiration': 1}}
        )

        user = await User.findById(user._id)

        res.status(200).json({success: true, message: 'Password changed successfully.'})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Server error'})
    }
}