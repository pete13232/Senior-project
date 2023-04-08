const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter an username'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
        type: String,
        enum: ['guest', 'specialist', 'admin'],
        default: 'guest'
    }
    // animation: [{type:'ObjectId', ref:'Animation'}],
    // validateLog: [{type:'ObjectId', ref:'ValidateLog'}]
})

const Animation = require("./Animation")
const ValidateLog = require("./ValidateLog")


module.exports = mongoose.model('User', UserSchema)