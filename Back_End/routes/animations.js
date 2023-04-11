const express = require('express')
const router = express.Router()

const { getAnimation, createAnimation, updateValidateLog, deleteAnimation, getAnimationLog, getAnimationByID, getAnimationByWordID } = require('../controllers/animations')
const { upload } = require('../controllers/multer')
const Word = require('../models/Word')


// Get All Animation
router.route("/animations")
    .get(getAnimation)

// Create New Animation
router.route("/animations/add")
    .post(upload.single('file'), createAnimation)

// Update Validate log to Selected Animation
router.route("/animations/validate/:animationID")
    // .put((req, res) => {
    //     const animationID = req.params.animationID
    //     const validateLog = req.body.validateID
    //     Animation.findByIdAndUpdate({ _id: animationID }, { $set: { validateLog: validateLog } }, { new: true })
    //         .then((doc) => {
    //             res.json(doc)
    //         }).catch(err => {
    //             res.json(err)
    //         })
    // })
    .post(updateValidateLog)

router.route("/animations/validateLog/:animationID")
    .get(getAnimationLog)


// Delete Selected Animation
router.route("/animations/delete/:animationID")
    .delete(deleteAnimation)


// Find animation By wordID
router.route("/animations/get")
    .get(getAnimationByWordID)


// Find animation By ID
router.route("/animations/:id")
    .get(getAnimationByID)



module.exports = router