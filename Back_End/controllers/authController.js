const User = require("../models/User")
const jwt = require('jsonwebtoken')


// Handle errors
const handleErrors = (err) => {
    // console.log(err.message, err.code)
    let errors = { username: '', password: '' }

    // incorrect username (log in)
    if (err.message === 'incorrect username') {
        errors.username = 'that username is not registered'
    }

    // incorrect password (log in)
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect'
    }

    // duplicate error code (log in)
    if (err.code === 11000) {
        errors.username = 'that username is already registered '
        return errors
    }

    // validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors
}

// Create Token
const maxAge = 3 * 24 * 60 * 60 // 3 days
const createToken = (id) => {
    return jwt.sign({ id }, 'tsl project secret', {
        expiresIn: maxAge
    })
}


const signup_post = async (req, res) => {
    const { username, password, firstName, lastName, role } = req.body

    try {
        const newUser = await User.create({ username, password, firstName, lastName, role })
        const token = createToken(newUser._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ newUser: newUser._id })
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

const login_post = (req, res) => {

}

const signup_get = (req, res) => {
    res.render('signup')
}

const login_get = (req, res) => {
    res.render('login')
}

module.exports = { signup_post, login_post, signup_get, login_get }