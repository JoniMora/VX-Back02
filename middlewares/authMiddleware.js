const jwt = require('jsonwebtoken')
const MongoStore = require('rate-limit-mongo')
const rateLimit = require('express-rate-limit')
const secretKey = process.env.JWT_SECRET
require('dotenv').config()
const mongodbUri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.mongodb.net/${process.env.MONGO_DATABASE}`

exports.limiter = rateLimit({
    store: new MongoStore({
        uri: mongodbUri,
        //expireTimeMs: 24 * 60 * 60 * 1000, // 24 horas
        expireTimeMs: 2 * 60 * 1000, // 2 minutos
    }),
    max: 5, 
    //windowMs: 60 * 60 * 1000, // 1 hora
    windowMs: 2 * 60 * 1000, // 2 minutos
    message: {error: 'Too many attempts. Your IP has been blocked for 24 hours.'},
})

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({error: 'Unauthorized access. Token not provided.'})
    }
  
    try {
        const decoded = jwt.verify(token, secretKey)
        req.user = decoded
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({error: 'Invalid token.'})
    }
}

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({error: 'Access forbidden. Unauthorized role.'})	
    }
    next()
}

exports.isPatient = (req, res, next) => {
    if (req.user.role === 'patient') {
        return next()
    }
    return res.status(403).json({error: 'Access forbidden. Unauthorized role.'})
}