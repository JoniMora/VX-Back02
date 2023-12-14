const Doctor = require('../models/doctor')

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find()
        res.json(doctors)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
  
exports.getDoctorDetails = async (req, res) => {
    const doctorID = req.params.id
  
    try {
        const doctor = await Doctor.findById(doctorID)
        if (!doctor) {
            return res.status(404).json({ error: 'Médico no encontrado.' })
        }
  
        // Logica para obtener turnos??
        res.json(doctor)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
  
exports.addDoctor = async (req, res) => {
    // ver el tema de only admin en el middleware

    const { name, specialty } = req.body

    try {
        const newDoctor = new Doctor({ name, specialty })
        await newDoctor.save()

        res.json({ message: 'Médico agregado exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}

  
exports.updateDoctor = async (req, res) => {
    const doctorID = req.params.id  
    const { name, specialty } = req.body

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorID, { name, specialty }, { new: true })
        
        if (!updatedDoctor) {
            return res.status(404).json({ error: 'Médico no encontrado.' })
        }

        res.json({ message: 'Información del médico actualizada exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}