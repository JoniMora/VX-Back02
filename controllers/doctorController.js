const Doctor = require('../models/doctor')
const Appointment = require('../models/appointment')

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('specialtyID')
        res.json(doctors)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
  
exports.getDoctorDetails = async (req, res) => {
    const doctorID = req.params.id

    console.log('Doctor ID:', doctorID)
    try {
        const doctor = await Doctor.findById(doctorID).populate('specialtyID').populate('appointment')
        
        if (!doctor) {
            return res.status(404).json({ error: 'Médico no encontrado.' })
        }

        const availableAppointments = await Appointment.find({
            doctor: doctorID,
            available: true,
        })

        console.log('Turnos Disponibles:', availableAppointments)

        // const formattedAppointments = availableAppointments.map(appointment => ({
        //     date: appointment.date,
        //     time: appointment.time,
        // }))

        //doctor.appointment = formattedAppointments

        doctor.appointment = availableAppointments
        
        await doctor.save()

        res.json(doctor)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
  
exports.addDoctor = async (req, res) => {
    const { name, specialtyID } = req.body

    try {
        const newDoctor = new Doctor({ name, specialtyID })
        await newDoctor.save()

        res.json({ message: 'Médico agregado exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}

  
exports.updateDoctor = async (req, res) => {
    const doctorID = req.params.id  
    const { name, specialtyID } = req.body

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorID, { name, specialtyID }, { new: true }).populate('specialtyID')

        if (!updatedDoctor) {
            return res.status(404).json({ error: 'Médico no encontrado.' })
        }

        res.json({ message: 'Información del médico actualizada exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}