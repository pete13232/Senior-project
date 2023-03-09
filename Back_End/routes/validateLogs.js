const express = require('express')
const router = express.Router()

const ValidateLog = require("../models/ValidateLog")

router.route("/")
    .get((req, res) => {
        ValidateLog.find({}).then((doc, err) => {
            if (doc) res.send(doc)
            else res.send(err)
        })
    })

// Create New ValidateLog
router.route("/add")
    .post((req, res) => {
        const newValidateLog = ValidateLog({
            animation: req.body.animationID,
            user: req.body.userID,
            validateStat: req.body.validateStat

        })
        newValidateLog.save().then((doc, err) => {
            if (doc) res.send(doc)
            else res.send(err)
        })
    })

module.exports = router