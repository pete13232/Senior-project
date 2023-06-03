const express = require('express')
const router = express.Router()

const { getLog } = require('../controllers/validateLog')

// get log
router.route("/validateLogs")
    .get(getLog)

module.exports = router