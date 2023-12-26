const mongoose = require("mongoose")
const validator = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo electrónico es obligatorio.'],
        trim: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Formato de correo electrónico no válido.'
        }
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        minlength: [7, 'La contraseña debe tener al menos 7 caracteres.'],
        trim: true,
        validate: {
            validator: value => !value.toLowerCase().includes('password'),
            message: 'La contraseña no puede contener la palabra "password".'
        }
    },

    role: { 
        type: String, 
        enum: ["admin", "patient"],
        required: [true, 'El rol es obligatorio.']
    },

    passwordRecovery: {
        token: String,
        expiration: Date,
        used: { type: Boolean, default: false }
    }
})

module.exports = mongoose.model("User", userSchema)