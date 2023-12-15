const Specialty = require('../models/specialty')

exports.getAllSpecialties = async (req, res) => {
     try {
          const specialties = await Specialty.find()
          res.json(specialties)
     } catch (error) {
          console.error(error)
          res.status(500).json({ error: 'Error en el servidor.' })
     }
}

exports.createSpecialty = async (req, res) => {
     const { name } = req.body   
     try {
          const newSpecialty = new Specialty({ name })
          await newSpecialty.save()
     
          res.json({ message: 'Especialidad creada exitosamente.' })
     } catch (error) {
          console.error(error)
          res.status(500).json({ error: 'Error en el servidor.' })
     }
}