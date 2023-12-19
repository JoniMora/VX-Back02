const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    specialtyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specialty', 
        required: true,
    },
    
    appointment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]
})

const Doctor = mongoose.model('Doctor', doctorSchema)

module.exports = Doctor