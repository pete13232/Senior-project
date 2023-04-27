const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const ValidateLogSchema = new mongoose.Schema({
    animationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Animation"
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    validateStat: { type: Boolean, default: false },
})

const Animation = require('./Animation')
const User = require('./User')

module.exports = mongoose.model('ValidateLog', ValidateLogSchema)