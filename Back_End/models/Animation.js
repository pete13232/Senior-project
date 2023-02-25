const mongoose = require('mongoose')

// Create Model (Compiled from Schema, instance of model is "Document")
const AnimationSchema = new mongoose.Schema({
    wordID: {type:String, trim:true, default:''},
    fileURL: {type:String, trim:true, default:''},
    lastValidateUserID: {type:String, trim:true, default:''},
    validateStatus: {type:Boolean, default:false},
})

module.exports = mongoose.model('Animation', AnimationSchema)