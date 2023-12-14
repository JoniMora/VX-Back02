const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')

    if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' })
    }
  
    try {
        const decoded = jwt.verify(token, 'firmaTokenVX')
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso prohibido. Rol no autorizado.' })
        }

        //para poner doctores?
        //quizas para remover token en el logout?
  
        req.user = decoded
  
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json({ error: 'Token no válido.' })
    }
}

