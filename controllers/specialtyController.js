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
          const existingSpecialty = await Specialty.findOne({ name })

          if (existingSpecialty) {
               return res.status(409).json({ success: false, error: 'Specialty already exists.', existingSpecialty })
          }
          const newSpecialty = new Specialty({ name })
          await newSpecialty.save()
     
          res.status(200).json({success: true, message: 'Specialty created successfully.' })
     } catch (error) {
          console.error(error)
          res.status(500).json({success: false, error: 'Server error.' })
     }
}