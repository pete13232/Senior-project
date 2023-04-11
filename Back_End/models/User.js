const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
        lowercase: true,
        default: 'guest'
    }
    // animation: [{type:'ObjectId', ref:'Animation'}],
    // validateLog: [{type:'ObjectId', ref:'ValidateLog'}]
})

// const Animation = require("./Animation")
// const ValidateLog = require("./ValidateLog")

// Hash password before doc saved to db
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// static method to login user
UserSchema.statics.login = async function (username, password) {
    const foundUser = await this.findOne({ username })
    if(foundUser) {
        const auth = await bcrypt.compare(password, foundUser.password)
        if(auth) {
            return foundUser
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username')
}

module.exports = mongoose.model('User', UserSchema)