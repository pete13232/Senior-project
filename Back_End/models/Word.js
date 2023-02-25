const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const wordSchema = new mongoose.Schema({
    wordName: {type:String, trim:true, default:''},
    description: {type:String, trim:true, default:''}
})

module.exports = mongoose.model('Word', wordSchema)