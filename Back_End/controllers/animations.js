const { default: mongoose } = require('mongoose')
const Animation = require('../models/Animation')
const User = require('../models/User')
const ValidateLog = require('../models/ValidateLog')

// Get All Animation
const getAnimation = async (req, res) => {
    try {
        const foundAnimation = await Animation.find({}).populate({
            path: "validateLog",
            select: { animation: 0, _id: 0 },
            populate: {
                path: "user",
                select: {
                    _id: 0,
                    username: 1
                }
            }
        })

        res.json({ data: foundAnimation })
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Create New Animation
const createAnimation = async (req, res) => {
    const animationData = req.body
    const newAnimation = new Animation(animationData)

    try {
        await newAnimation.markModified('file')
        await newAnimation.save()
        res.json(newAnimation)
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Updata Validate log to Selected Animation (when user validate)
const updateValidateLog = async (req, res) => {
    const { animationID } = req.params
    const { userID } = req.body
    const { validateStat } = req.body
    const newValidateLog = new ValidateLog({
        animation: animationID,
        user: userID,
        validateStat: validateStat
    })
    const verifyUserID = mongoose.Types.ObjectId.isValid(userID)
    const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID)

    if (!(verifyUserID && verifyAnimationID)) {
        res.json("userID or animationID isn't ObjectID")
    } else {

        try {
            const validateLog = await newValidateLog.save()
            if (validateLog) {
                const count = await User.countDocuments({ _id: userID })

                if (count > 0) {
                    await User.findByIdAndUpdate({ _id: userID }, { $push: { validateLog: validateLog._id } })
                    await Animation.findByIdAndUpdate({ _id: animationID }, { $set: { validateLog: validateLog._id } })
                    res.json(validateLog)
                } else {
                    res.json("userID doesn't exist")
                }
            } else {
                res.json("Can't add validateLog to user or animation")
            }
        } catch (error) {
            res.json({ message: error.message })
        }
    }
}

// Delete Selected Animation
const deleteAnimation = async (req, res) => {
    const { animationID } = req.params
    const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID)
    if (!verifyAnimationID) {
        res.json("animationID isn't ObjectID")
    } else {
        try {
            const deletedAnimation = await Animation.findByIdAndDelete({ _id: animationID })
            if (deletedAnimation) {
                res.json(`Animation "${deleteAnimation.word}" has been deleted`)
            } else {
                res.json("No animation deleted")
            }
        } catch (error) {
            res.json({ message: error.message })
        }
    }
}

module.exports = { getAnimation, createAnimation, updateValidateLog, deleteAnimation }