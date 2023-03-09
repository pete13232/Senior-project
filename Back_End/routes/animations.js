const express = require('express')
const router = express.Router()

const Animation = require('../models/Animation')
const ValidateLog = require("../models/ValidateLog")
const User = require('../models/User')

router.route("/")
    .get((req, res) => {
        Animation.find({}).populate({
            path: "validateLog",
            select: { animation: 0, _id: 0 },
            populate: {
                path: "user",
                select: {
                    _id: 0,
                    username: 1
                }
            }
        }).then(doc => {
            res.json(doc)
        }).catch(err => {
            res.json(err)
        })
    })

// Create New Animation
router.route("/add")
    .post((req, res) => {
        const word = req.body.word
        const file = req.body.file
        const newAnimation = Animation({
            word: word,
            file: file,
            validateLog: null
        })
        newAnimation.save()
            .then(doc => res.json(doc))
            .catch(err => res.json(err))
    })

// Add Validate log to Selected Animation
router.route("/validate/:animationID")
    .put((req, res) => {
        const animationID = req.params.animationID
        const validateLog = req.body.validateID
        Animation.findByIdAndUpdate({ _id: animationID }, { $set: { validateLog: validateLog } }, { new: true })
            .then((doc) => {
                res.json(doc)
            }).catch(err => {
                res.json(err)
            })
    })
    .post((req, res) => {
        const animationID = req.params.animationID
        const userID = req.body.userID
        const validateStat = req.body.validateStat
        const newValidateLog = ValidateLog({
            animation: animationID,
            user: userID,
            validateStat: validateStat
        })
        newValidateLog.save().then(validateLog => {
            if (validateLog) {
                User.findByIdAndUpdate({ _id: userID }, { $push: { validateLog: validateLog._id } })
                    .then(() => {
                        Animation.findByIdAndUpdate({ _id: animationID }, { $set: { validateLog: validateLog._id } })
                            .then(() => {
                                res.json(validateLog)
                            }).catch(err => {
                                res.json(err)
                            })
                    }).catch(err => {
                        res.json(err)
                    })
            }
            else res.json(err)
        })
    })

// Delete Selected Animation
router.route("/delete/:animationID")
    .delete((req, res) => {
        const animationID = req.params.animationID
        Animation.deleteOne({ _id: animationID })
            .then(doc => {
                if (doc.deletedCount === 1) {
                    res.json("Animation deleted success !")
                } else {
                    res.json("No animation you looking for to deleted !")
                }
            })
            .catch(err => res.json(err))
    })


module.exports = router