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
            // console.log(doc[0])
            res.send(doc)
        }).catch(err => {
            res.send(err)
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
            .then(doc => res.send(doc))
            .catch(err => res.send(err))
    })

// Add Validate log to Selected Animation
router.route("/validate/:animationID")
    .put((req, res) => {
        const animationID = req.params.animationID
        const validateLog = req.body.validateID
        Animation.findByIdAndUpdate({ _id: animationID }, { $set: { validateLog: validateLog } }, { new: true })
            .then((doc) => {
                res.send(doc)
            }).catch(err => {
                res.send(err)
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
        newValidateLog.save().then((data, err) => {
            if (data) {
                User.findByIdAndUpdate({ _id: userID }, { $push: { validateLog: data._id } })
                    .then(() => {
                        Animation.findByIdAndUpdate({ _id: animationID }, { $set: { validateLog: data._id } })
                            .then(() => {
                                res.send(data)
                            }).catch(err => {
                                res.send(err)
                            })
                    }).catch(err => {
                        res.send(err)
                    })
            }
            else res.send(err)
        })
    })

// Delete Selected Animation
router.route("/delete/:animationID")
    .delete((req, res) => {
        const animationID = req.params.animationID
        Animation.deleteOne({ _id: animationID }, (err, result) => {
            if (!err && result.deletedCount != 0) {
                res.send("Animation deleted success !")
            } else if (result.deletedCount == 0) {
                res.send("No animation you looking for to deleted !")
            } else {
                res.send(err)
            }
        })
    })


module.exports = router