const express = require('express')
const router = express.Router()

const Animation = require('../models/Animation')

router.route("/:wordID")
    .get((req, res) => {
        res.send("this is your animation")
    })
    .post((req, res) => {
        const newAnimation = new Animation({
            wordID: req.params.wordID,
            lastValidateUserID: req.body.lastValidateUserID,
            validateStatus: req.body.validateStatus,
        })
        newAnimation.save((err) => {
            if (!err) {
                res.send("Create Animation Successfull")
            } else {
                res.send(err)
            }
        })
    })

module.exports = router