const express = require('express')
const router = express.Router()

const ValidateLog = require("../models/ValidateLog")

router.route("/validateLogs")
    .get((req, res) => {
        ValidateLog.find({}).then((doc, err) => {
            if (doc) res.json(doc)
            else res.json(err)
        })
    })

// Create New ValidateLog
router.route("/validateLogs/add")
    .post((req, res) => {
        const newValidateLog = ValidateLog({
            animation: req.body.animationID,
            user: req.body.userID,
            validateStat: req.body.validateStat

        })
        newValidateLog.save().then((doc, err) => {
            if (doc) res.json(doc)
            else res.json(err)
        })
    })

module.exports = router