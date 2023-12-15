const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
     doctorID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
     },
     dateTime: {
          type: Date,
          required: true,
     },
     patientID: {
          type: mongoose.Schema.Types.ObjectId,
          default: null,
     },
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment