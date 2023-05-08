const express = require('express')
const router = express.Router()

const { getAnimation, uploadCloudAnimation, updateValidateLog, deleteAnimation, getAnimationLog, getAnimationByID, getAnimationByWordID, updateValidateLog_get, uploadLocalAnimation, deleteLocalOriginalFile, editAnimation, deleteLocalCompressFile, compressJsonAnimation } = require('../controllers/animations')
const { requireAuth, checkPermission } = require('../middleware/authMiddleware')
const { route } = require('./users')


// Get All Animation
router.route("/animations")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimation)

// Create New Animation (json)
router.route("/animations/add")
    .post(uploadCloudAnimation)

// Create New Animation to local (.fbx)
router.route("/animations/add/local")
    .post(uploadLocalAnimation)

// Delete local original file (.fbx)
router.route("/animations/delete/local")
    .delete(deleteLocalOriginalFile)

// Delete local compressed file (.fbx)
router.route("/animations/delete/local/compressed")
    .delete(deleteLocalCompressFile)

// Compresss original .json file from GCS
router.route("/animations/compress/GCS")
    .get(compressJsonAnimation)


// Find animation By wordID
router.route("/animations/get")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationByWordID)

// Validate Animation 
router.route("/animations/validate/:animationID")
    .post([requireAuth, checkPermission(['admin', 'specialist'])], updateValidateLog)


// Get All animation validate log
router.route("/animations/validateLog/:animationID")
    .get(getAnimationLog)

// Delete Selected Animation
router.route("/animations/delete/:animationID")
    .delete([requireAuth, checkPermission(['admin'])], deleteAnimation)

// Find animation By ID
router.route("/animations/:animationID")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getAnimationByID)


module.exports = router