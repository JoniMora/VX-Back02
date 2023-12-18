const mongoose = require('mongoose')
const Appointment = require('../models/appointment')

exports.createAppointment = async (req, res) => {
     try {
          const { doctor, dateTime } = req.body

          const newAppointment = new Appointment({
               doctor,
               dateTime,
          })

          await newAppointment.save()
          res.status(201).json({ message: 'Turno creado exitosamente.' })
     } catch (error) {
          console.error(error)
          res.status(500).json({ error: 'Error en el servidor.' })
     }
}


exports.updateAppointment = async (req, res) => {
    try {
        const { aid } = req.params
        const { doctor, dateTime } = req.body
 
        const existingAppointment = await Appointment.findById(aid)
     
        if (!existingAppointment) {
            return res.status(404).json({ error: 'Turno no encontrado.' })
        }
     
        existingAppointment.doctor = doctor
        existingAppointment.dateTime = dateTime
     
        await existingAppointment.save()
     
        res.json({ message: 'Turno actualizado exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}


exports.deleteAppointment = async (req, res) => {
    try {
        const { aid } = req.params

        const deletedAppointment = await Appointment.findByIdAndDelete(aid)
        if (!deletedAppointment) {
                return res.status(404).json({ error: 'Turno no encontrado.' })
        }
    
        res.json({ message: 'Turno eliminado exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
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

//No funciona, verlo despues
exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const { did } = req.params;
        console.log('ID del médico:', did)

        const appointments = await Appointment.find({ doctorID: did }).populate('doctorID')

        appointments.forEach(appointment => {
            console.log('Fecha y hora:', appointment.dateTime)
        })

        // const appointments = await Appointment.find({
        //     doctorID: did,
        //     dateTime: { $exists: true, $ne: null } // Asegura que dateTime esté presente y no sea nulo
        // }).sort('dateTime')

        //const appointments = await Appointment.find({ doctorID: did }).populate('doctorID')

        console.log('Turnos por médico:', appointments)

        res.json({ Doctor: did, appointments })
    } catch (error) {
        console.error('Error en getAppointmentsByDoctor:', error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
