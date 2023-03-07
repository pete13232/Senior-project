const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const AnimationSchema = new mongoose.Schema({
    word: {type: String},
    file: {type:String},
    validateLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ValidateLog"
    }
}) 

const User = require("./User")
const ValidateLog = require("./ValidateLog")

module.exports = mongoose.model('Animation', AnimationSchema)