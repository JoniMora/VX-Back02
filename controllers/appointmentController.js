const mongoose = require('mongoose')
const Appointment = require('../models/appointment')
const Doctor = require('../models/doctor')
const User = require('../models/user')

exports.createAppointment = async (req, res) => {
    try {
        const { doctorID, date, time } = req.body

        const newAppointment = new Appointment({
        doctor: doctorID,
        date: new Date(date),
        time: time,
        available: true,
        patient: []
        })

        const savedAppointment = await newAppointment.save()

        const doctor = await Doctor.findByIdAndUpdate(
            doctorID,
            { $push: { turnos: savedAppointment._id } },
            { new: true }
        )

        res.status(201).json({ success: true, appointment: savedAppointment })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al crear el turno' })
    }
}

exports.updateAppointment = async (req, res) => {
    try {
        const { aid } = req.params
        const { newDate, newTime } = req.body
    
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            aid,
            { date: new Date(newDate), time: newTime },
            { new: true }
        )
    
        if (!updatedAppointment) {
            return res.status(404).json({ success: false, message: 'Turno no encontrado' })
        }
    
        res.status(200).json({ success: true, appointment: updatedAppointment })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al actualizar el turno' })
    }
}

exports.deleteAppointment = async (req, res) => {
    try {
        const { aid } = req.params

        const deletedAppointment = await Appointment.findByIdAndDelete(aid)
        if (!deletedAppointment) {
            return res.status(404).json({ success: false, message: 'Turno no encontrado' })
        }

        res.status(200).json({ success: true, message: 'Turno eliminado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al eliminar el turno' })
    }
}

exports.getAllAppointments = async (req, res) => {
      try {
          const appointments = await Appointment.find()
      
          console.log('Todos los turnos:', appointments)
      
          res.json(appointments)
      } catch (error) {
          console.error(error)
          res.status(500).json({ error: 'Error en el servidor.' })
      }
} 

exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const { did } = req.params

        const appointments = await Appointment.find({ doctor: did })

        res.status(200).json({ success: true, appointments })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al obtener los turnos del médico' })
    }
}

exports.reserveAppointment = async (req, res) => {
    try {
        const { patientID } = req.body
        const { aid } = req.params

        const existingPatient = await User.findById(patientID)
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' })
        }

        const appointment = await Appointment.findById(aid)
        if (!appointment || !appointment.available) {
            return res.status(404).json({ success: false, message: 'Turno no disponible' })
        }

        appointment.available = false
        appointment.patient.push(patientID)
        await appointment.save()

        res.status(200).json({ success: true, message: 'Turno reservado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al reservar el turno' })
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const { patientID } = req.body
        const { aid } = req.params
    
        const existingPatient = await User.findById(patientID)
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' })
        }
    
        const appointment = await Appointment.findById(aid);
        if (!appointment || (appointment.available && appointment.patient.length === 0)) {
            return res.status(404).json({ success: false, message: 'Turno no encontrado o ya cancelado' })
        }

        appointment.available = true
        appointment.patient = []
        await appointment.save()
  
        res.status(200).json({ success: true, message: 'Turno cancelado correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al cancelar el turno' })
    }
}

exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const { pid } = req.params
    
        const existingPatient = await User.findById(pid)
        if (!existingPatient || existingPatient.role !== 'patient') {
            return res.status(404).json({ success: false, message: 'Paciente no encontrado' })
        }
  
        const appointments = await Appointment.find({ patient: pid })
  
        res.status(200).json({ success: true, appointments })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Error al obtener los turnos del paciente' })
    }
  }
