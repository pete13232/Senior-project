const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const wordSchema = new mongoose.Schema({
    word: {type:String, trim:true, default:''},
    description: {type:String, trim:true, default:''},
    animation: [{type:'ObjectId', ref:'Animation'}]
})

const Animation = require("./Animation")

module.exports = mongoose.model('Word', wordSchema)