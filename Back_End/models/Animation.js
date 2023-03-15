const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const AnimationSchema = new mongoose.Schema({
    word: { type: String, required: true },
    file: { type: mongoose.Schema.Types.Mixed, required: true },
    validateLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ValidateLog",
    }
})

const User = require("./User")
const ValidateLog = require("./ValidateLog")

module.exports = mongoose.model('Animation', AnimationSchema)