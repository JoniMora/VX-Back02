const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' })
    }
  
    try {
        const decoded = jwt.verify(token, 'firmaTokenVX')

        req.user = decoded
  
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ error: 'Token no válido.' })
    }
}

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso prohibido. Rol no autorizado.' })	
    }
    next()
}

exports.isPatient = (req, res, next) => {
    if (req.user.role === 'patient') {
        return next()
    }

    return res.status(403).json({ error: 'Acceso prohibido. Rol no autorizado.' })
}