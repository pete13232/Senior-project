const express = require('express')
const router = express.Router()

const { getAnimation, uploadCloudAnimation, updateValidateLog, deleteAnimation, getAnimationLog, getAnimationByID, getAnimationByWordID, updateValidateLog_get, uploadLocalAnimation, unlinkTempFile, editAnimation } = require('../controllers/animations')
const { requireAuth, checkPermission } = require('../middleware/authMiddleware')


// Get All Animation
router.route("/animations")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimation)

// Create New Animation (json)
router.route("/animations/add")
    .post(uploadCloudAnimation)

// Create Animation to Local (fbx)
router.route("/animations/add/local")
    .post(uploadLocalAnimation)

// Remove temp file (.fbx)
router.route("/animations/delete/local")
    .delete(unlinkTempFile)


// Find animation By wordID
router.route("/animations/get")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationByWordID)

// Validate Animation
router.route("/animations/validate/:animationID")
    .post([requireAuth, checkPermission(['admin', 'specialist'])], updateValidateLog)


// Get All animation validate log
router.route("/animations/validateLog/:animationID")
    .get([requireAuth, checkPermission(['admin', 'specialist'])], getAnimationLog)

// Delete Selected Animation
router.route("/animations/delete/:animationID")
    .delete([requireAuth, checkPermission(['admin'])], deleteAnimation)

// Find animation By ID
router.route("/animations/:animationID")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationByID)
    .patch([requireAuth, checkPermission(['admin', 'specialist'])], editAnimation)


module.exports = router