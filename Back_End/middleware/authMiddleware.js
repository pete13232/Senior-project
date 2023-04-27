const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    // const token = req.cookies.jwt
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization.split(' ')[1]
    console.log(token)
    // check json web token exists & if verified
    if (token) {
        jwt.verify(token, 'tsl project secret', (err, decodedToken) => {
            if (err) {
                res.json({ message: err.message })
                // res.redirect('/login')
            } else {
                // console.log(decodedToken)
                next()
            }
        })
    } else {
        // res.redirect('/login')
        res.json({ message: "Please Login" })
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]

    if (token) {
        jwt.verify(token, 'tsl project secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                console.log(res.locals.user)
                next()
            }
        })
    } else {
        res.locals.user = new User({})
        next()
    }
}


const checkPermission = (role) => (req, res, next) => {
    if (role.includes(res.locals.user.role)) {
        next()
    } else {
        res.status(403).json("You don't have permissoin")
    }
}


module.exports = { requireAuth, checkUser, checkPermission }