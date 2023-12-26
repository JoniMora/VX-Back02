const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
     doctor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Doctor',
          required: true
     },
     date: {
          type: Date,
          required: true
     },
     time: {
          type: String,
          required: true
     },
     available: {
          type: Boolean,
          default: true
     },
     patient: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Patient'
     },
     cancellationHistory: [{
          cancellationDate: {
              type: Date,
              default: Date.now
          },
          canceledByPatient: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Patient'
          },
          canceledAppointmentTime: {
              type: String
          }
      }]
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment