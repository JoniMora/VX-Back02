const jwt = require('jsonwebtoken')

exports.authenticateToken = (req, res, next) => {
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

