const mongoose = require('mongoose')
const Appointment = require('../models/appointment')
const User = require('../models/user')

exports.createAppointment = async (req, res) => {
    try {
        const {doctorID, date, time, patientID} = req.body
        if (!doctorID || !date || !time) {
            return res.status(400).json({success: false, message: 'Please provide all required fields.'})
        }

        if (!mongoose.Types.ObjectId.isValid(doctorID)) {
            return res.status(400).json({success: false, message: 'Invalid doctor ID.'})
        }

        const newAppointment = new Appointment({
            doctor: doctorID,
            date: new Date(date),
            time: time,
            available: true,
            patient: patientID,
        })

        const savedAppointment = await newAppointment.save()

        res.status(201).json({success: true, appointment: savedAppointment})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Error when creating the appointment.'})
    }
}

exports.updateAppointment = async (req, res) => {
    try {
        const {aid} = req.params
        const {newDate, newTime} = req.body
    
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            aid,
            {date: new Date(newDate), time: newTime},
            {new: true}
        )
    
        if (!updatedAppointment) {
            return res.status(404).json({success: false, message: 'Appointment not found.'})
        }
    
        res.status(200).json({success: true, appointment: updatedAppointment})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Error updating appointment.'})
    }
}

exports.deleteAppointment = async (req, res) => {
    try {
        const {aid} = req.params

        const appointment = await Appointment.findById(aid)
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' })
        }

        if (appointment.available === false) {
            return res.status(400).json({ success: false, message: 'Cannot delete a reserved appointment.' })
        }

        const deletedAppointment = await Appointment.findByIdAndDelete(aid)

        if (!deletedAppointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' })
        }

        res.status(200).json({success: true, message: 'Appointment deleted successfully.'})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Error deleting appointment.'})
    }
}

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
      
        res.status(200).json({success: true, data: appointments})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Error while retrieving the list of appointments.'})
    }
}

exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const {did} = req.params

        const appointments = await Appointment.find({doctor: did})

        res.status(200).json({success: true, data: appointments})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Error getting doctor\'s appointments.'})
    }
}

exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const {pid} = req.params
    
        const existingPatient = await User.findById(pid)
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({success: false, message: 'Patient not found.'})
        }
  
        const appointments = await Appointment.find({patient: pid})
  
        res.status(200).json({success: true, data: appointments})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message: 'Error getting patient\'s appointments.'})
    }
}

exports.reserveAppointment = async (req, res) => {
    try {
        const {patientID} = req.body
        const {aid} = req.params

        const existingPatient = await User.findById(patientID)
        if (!existingPatient || existingPatient.role !== 'patient'){
            return res.status(404).json({success: false, message: 'Patient not found.'})
        }

        const appointment = await Appointment.findById(aid)
        if (!appointment || !appointment.available){
            return res.status(404).json({success: false, message: 'Appointment not available.'})
        }

        appointment.available = false
        appointment.patient = patientID
        await appointment.save()

        res.status(200).json({success: true, message: 'Appointment booked correctly.'})
    } catch (error){
        console.error(error)
        res.status(500).json({success: false, message: 'Error when booking the appointment.'})
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const { patientID } = req.body
        const { aid } = req.params

        const existingPatient = await User.findById(patientID)
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({ success: false, message: 'Patient not found.' })
        }

        const appointment = await Appointment.findById(aid)
        if (!appointment || appointment.available || !appointment.patient.equals(patientID)) {
            return res.status(404).json({ success: false, message: 'Appointment not found or not associated with the patient.' })
        }

        const currentDateTime = new Date()

        appointment.cancellationHistory.push({
            cancellationDate: currentDateTime,
            canceledByPatient: patientID,
            canceledAppointmentTime: appointment.time
        })

        appointment.available = true
        appointment.patient = null

        await appointment.save()

        res.status(200).json({ success: true, message: 'Appointment canceled successfully.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error canceling appointment.' })
    }
}

exports.getCancellationHistoryByPatient = async (req, res) => {
    try {
        const { pid } = req.params

        const existingPatient = await User.findById(pid)
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({ success: false, message: 'Patient not found.' })
        }

        const cancellationHistory = await Appointment.find({
            'cancellationHistory.canceledByPatient': existingPatient._id,
            'cancellationHistory.0': { $exists: true }
        })

        if (cancellationHistory.length === 0) {
            return res.status(404).json({ success: false, message: 'No cancellation history found for the patient.' })
        }

        res.status(200).json({ success: true, cancellationHistory: cancellationHistory[0].cancellationHistory })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error obtaining patient cancellation history.' })
    }
}