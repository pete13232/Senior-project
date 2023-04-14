const express = require('express')
const router = express.Router()

const { getAnimation, createAnimation, updateValidateLog, deleteAnimation, getAnimationLog, getAnimationByID, getAnimationByWordID, updateValidateLog_get } = require('../controllers/animations')
const { upload } = require('../middleware/multer')
const { requireAuth, checkPermission } = require('../middleware/authMiddleware')


// Get All Animation
router.route("/animations")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimation)

// Create New Animation
router.route("/animations/add")
    .post(upload.single('file'), createAnimation)

// Validate Animation
router.route("/animations/validate/:animationID")
    .post([requireAuth, checkPermission(['admin', 'specialist'])], updateValidateLog)


// Get All animation validate log
router.route("/animations/validateLog/:animationID")
    .get([requireAuth, checkPermission(['admin', 'specialist'])], getAnimationLog)


// Delete Selected Animation
router.route("/animations/delete/:animationID")
    .delete([requireAuth, checkPermission(['admin'])], deleteAnimation)


// Find animation By wordID
router.route("/animations/get")
    .get([requireAuth, checkPermission(['admin', 'specialist', 'guest'])], getAnimationByWordID)


// Find animation By ID
router.route("/animations/:animationID")
    .get([requireAuth, checkPermission(['admin', 'specialist', 'guest'])], getAnimationByID)



module.exports = router