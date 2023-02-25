const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const UserSchema = new mongoose.Schema({
    username: { type: String, default:'' },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    role: {
        type: String,
        enum: ['guest', 'specialist', 'admin'],
        default: ''
    }
})

module.exports = mongoose.model('User', UserSchema)