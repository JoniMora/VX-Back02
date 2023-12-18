const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
     doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Doctor',
          required: true,
     },
     dateTime: {
          type: Date,
          required: true,
     },
     patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Patient',
          default: null,
     },
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment