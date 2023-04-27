const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const AnimationSchema = new mongoose.Schema({
    wordID: { type:'ObjectId', ref:'Word', required: true },
    file: { type: String, required: true },
})

const Word = require('./Word')
module.exports = mongoose.model('Animation', AnimationSchema)