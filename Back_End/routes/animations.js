const express = require('express')
const router = express.Router()

const { getAnimation, createAnimation, updateValidateLog, deleteAnimation, getAnimationLog, getAnimationByID, getAnimationByWordID, updateValidateLog_get } = require('../controllers/animations')
const { upload } = require('../controllers/multer')
const Word = require('../models/Word')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')


// Get All Animation
router.route("/animations")
    .get(getAnimation)

// Create New Animation
router.route("/animations/add")
    .post(upload.single('file'), createAnimation)

// Update Validate log to Selected Animation
router.route("/animations/validate/:animationID")
    .post(requireAuth, updateValidateLog)


// Get All animation validate log
router.route("/animations/validateLog/:animationID")
    .get(getAnimationLog)


// Delete Selected Animation
router.route("/animations/delete/:animationID")
    .delete(deleteAnimation)


// Find animation By wordID
router.route("/animations/get")
    .get(getAnimationByWordID)


// Find animation By ID
router.route("/animations/:animationID")
    .get(getAnimationByID)



module.exports = router