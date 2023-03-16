const express = require('express')
const router = express.Router()

const User = require('../models/User')
const { getUser, createUser } = require('../controllers/users')

// Get all user
router.route("/")
    .get(getUser)

// Create New User
router.route("/add")
    .post(createUser)


// router.route("/validate/:userID")
//     // User Log
//     .put((req, res) => {
//         User.findByIdAndUpdate({ _id: req.params.userID }, { $push: { validateLog: req.body.validateID } }, { new: true })
//             .then(doc => res.json(doc))
//             .catch(err => res.json(err))
//     })

module.exports = router