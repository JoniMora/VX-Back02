const Appointment = require('../models/appointment')

exports.createAppointment = async (req, res) => {
     try {
          const { doctorID, dateTime } = req.body

          const newAppointment = new Appointment({
               doctorID,
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
        const { doctorID, dateTime } = req.body
 
        const existingAppointment = await Appointment.findById(aid)
     
        if (!existingAppointment) {
            return res.status(404).json({ error: 'Turno no encontrado.' })
        }
     
        existingAppointment.doctorID = doctorID
        existingAppointment.dateTime = dateTime
     
        await existingAppointment.save()
     
        res.json({ message: 'Turno actualizado exitosamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error en el servidor.' })
    }
}