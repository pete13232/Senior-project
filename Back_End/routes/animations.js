const express = require('express')
const router = express.Router()
const { getAnimation, uploadCloudAnimation, updateValidateLog, deleteAnimation, getAnimationLog, getAnimationByID, getAnimationByWordID } = require('../controllers/animations')
const { requireAuth, checkPermission } = require('../middleware/authMiddleware')


// Get All Animation
router.route("/animations")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimation)

// Create New Animation (json)
router.route("/animations/add")
    .post([requireAuth, checkPermission(['admin'])], uploadCloudAnimation)

// Find animation By wordID
router.route("/animations/get")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationByWordID)

// Validate Animation 
router.route("/animations/validate/:animationID")
    .post([requireAuth, checkPermission(['admin', 'specialist'])], updateValidateLog)

// Get All animation validate log
router.route("/animations/validateLog/:animationID")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationLog)

// Delete Selected Animation
router.route("/animations/delete/:animationID")
    .delete([requireAuth, checkPermission(['admin'])], deleteAnimation)

// Find animation By ID
router.route("/animations/:animationID")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationByID)


module.exports = router