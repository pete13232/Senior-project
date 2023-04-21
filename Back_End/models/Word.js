const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const wordSchema = new mongoose.Schema({
    word: {type:String, trim:true, default:'', required: true},
    description: {type:String, trim:true, default:'', required: true},
})


module.exports = mongoose.model('Word', wordSchema)