const mongoose = require('mongoose')
const Appointment = require('../models/appointment')
const Doctor = require('../models/doctor')

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


// exports.createAppointment = async (req, res) => {
//      try {
//           const { doctor, dateTime } = req.body

//           const newAppointment = new Appointment({
//                doctor,
//                dateTime,
//           })

//           await newAppointment.save()
//           res.status(201).json({ message: 'Turno creado exitosamente.' })
//      } catch (error) {
//           console.error(error)
//           res.status(500).json({ error: 'Error en el servidor.' })
//      }
// }


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


// exports.updateAppointment = async (req, res) => {
//     try {
//         const { aid } = req.params
//         const { doctor, dateTime } = req.body
 
//         const existingAppointment = await Appointment.findById(aid)
     
//         if (!existingAppointment) {
//             return res.status(404).json({ error: 'Turno no encontrado.' })
//         }
     
//         existingAppointment.doctor = doctor
//         existingAppointment.dateTime = dateTime
     
//         await existingAppointment.save()
     
//         res.json({ message: 'Turno actualizado exitosamente.' })
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ error: 'Error en el servidor.' })
//     }
// }

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

// exports.deleteAppointment = async (req, res) => {
//     try {
//         const { aid } = req.params

//         const deletedAppointment = await Appointment.findByIdAndDelete(aid)
//         if (!deletedAppointment) {
//                 return res.status(404).json({ error: 'Turno no encontrado.' })
//         }
    
//         res.json({ message: 'Turno eliminado exitosamente.' })
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ error: 'Error en el servidor.' })
//     }
// }


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


exports.reserveAppointment = async (req, res) => {
    try {
        const { aid } = req.params
        const { userID } = req.user
        
        const existingAppointment = await Appointment.findById(aid)
        
        if (!existingAppointment) {
            return res.status(404).json({ error: 'Turno no encontrado.' })
        }
        
        existingAppointment.patient = userID

        await existingAppointment.save()

        res.json({ message: 'Turno reservado exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}
