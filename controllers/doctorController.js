const Doctor = require('../models/doctor')
const Appointment = require('../models/appointment')

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('specialtyID')

        res.status(200).json({success: true, data: doctors})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, error: 'Server error.'})
    }
}
  
exports.getDoctorDetails = async (req, res) => {
    const doctorID = req.params.id

    try {
        const doctor = await Doctor.findById(doctorID).populate('specialtyID').populate('appointment')
        if (!doctor) {
            return res.status(404).json({success: false, error: 'Doctor not found.'})
        }

        const availableAppointments = await Appointment.find({
            doctor: doctorID,
            available: true,
        })

        doctor.appointment = availableAppointments
        await doctor.save()

        res.status(200).json({success: true, data: doctor})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, error: 'Server error.'})
    }
}
  
exports.addDoctor = async (req, res) => {
    const {name, specialtyID} = req.body

    try {
        const newDoctor = new Doctor({name, specialtyID})
        await newDoctor.save()

        res.status(200).json({success: true, message: 'Doctor successfully added.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, error: 'Server error.'})
    }
}

  
exports.updateDoctor = async (req, res) => {
    const doctorID = req.params.id  
    const {name, specialtyID} = req.body

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorID, {name, specialtyID}, {new: true}).populate('specialtyID')
        if (!updatedDoctor) {
            return res.status(404).json({success: false, error: 'Doctor not found.'})
        }

        res.status(200).json({success: true, message: 'Doctor information updated successfully.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, error: 'Server error.'})
    }
}