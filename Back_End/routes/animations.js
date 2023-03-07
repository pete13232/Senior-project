const express = require('express')
const router = express.Router()

const Animation = require('../models/Animation')

router.route("/")
    .get((req, res) => {
        Animation.find({}).populate({
            path: "validateLog",
            select:{animation: 0},
            populate: {
                path: "user",
                select: {
                    username: 1
                }
            }
        }).then((success, err) => {
            if (success) {
                console.log(success[0])
                res.send(success)
            }
            else res.send(err)
        })
    })

// Create New Animation
router.route("/add")
    .post((req, res) => {
        const newAnimation = Animation({
            word: req.body.word,
            file: req.body.file,
            validateLog: null
        })
        newAnimation.save().then((success, err) => {
            if (success) res.send(success)
            else res.send(err)
        })
    })

// Add Validate log to Selected Animation
router.route("/validate/:animationID")
    .put((req, res) => {
        Animation.findByIdAndUpdate({ _id: req.params.animationID }, { $set: { validateLog: req.body.validateID } }, { new: true }).then((doc, err) => {
            if (doc) res.send(doc)
            else res.send(err)
        })
    })

// Delete Selected Animation
router.route("/delete/:animationID")
    .delete((req, res) => {
        Animation.deleteOne({ _id: req.params.animationID }, (err, result) => {
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