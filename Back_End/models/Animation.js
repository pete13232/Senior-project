const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const AnimationSchema = new mongoose.Schema({
    wordID: { type:'ObjectId', ref:'Word', required: true },
    file: { type: String, required: true },
    // validateLog: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "ValidateLog",
    // }
})

const Word = require('./Word')
const User = require("./User")
const ValidateLog = require("./ValidateLog")

module.exports = mongoose.model('Animation', AnimationSchema)