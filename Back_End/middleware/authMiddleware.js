const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Check if request Auth
const requireAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization?.split(' ')[1]
    // check json web token exists & if verified
    if (token) {
        jwt.verify(token, 'tsl project secret', (err, decodedToken) => {
            if (err) {
                res.json({ message: err.message })
            } else {
                next()
            }
        })
    } else {
        res.json({ message: "Please Login" })
    }
}

// Check current user
const checkUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (token) {
        jwt.verify(token, 'tsl project secret', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null
                next()
            } else {
                let user = await User.findById(decodedToken.user._id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = new User({})
        next()
    }
}

// Check permission
const checkPermission = (role) => (req, res, next) => {
    if (role.includes(res.locals.user.role)) {
        next()
    } else {
        res.status(403).json("You don't have permissoin")
    }
}


module.exports = { requireAuth, checkUser, checkPermission }