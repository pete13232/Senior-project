const express = require('express')
const router = express.Router()

const { getAnimation, createAnimation, updateValidateLog, deleteAnimation } = require('../controllers/animations')

// Get All Animation
router.route("/")
    .get(getAnimation)

// Create New Animation
router.route("/add")
    .post(createAnimation)

// Update Validate log to Selected Animation
router.route("/validate/:animationID")
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

// Delete Selected Animation
router.route("/delete/:animationID")
    .delete(deleteAnimation)


module.exports = router