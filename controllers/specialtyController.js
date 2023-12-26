const Specialty = require('../models/specialty')

exports.getAllSpecialties = async (req, res) => {
     try {
          const specialties = await Specialty.find()

          res.status(200).json({success: true, data:specialties})
     } catch (error) {
          console.error(error)
          res.status(500).json({success: false, error: 'Server error.'})
     }
}

exports.createSpecialty = async (req, res) => {
     const { name } = req.body   
     try {
          const newSpecialty = new Specialty({ name })
          await newSpecialty.save()
     
          res.status(200).json({success: true, message: 'Specialty created successfully.' })
     } catch (error) {
          console.error(error)
          es.status(500).json({success: false, error: 'Server error.' })
     }
}