const express = require('express')
const router = express.Router()

const ValidateLog = require("../models/ValidateLog")
const { getLog } = require('../controllers/validateLog')

router.route("/validateLogs")
    .get(getLog)

module.exports = router