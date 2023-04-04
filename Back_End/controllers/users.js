const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const ValidateLog = require("../models/ValidateLog");
const { populate } = require("../models/Word");

// Get all userSS
const getUser = async (req, res) => {
    try {
        // const foundUser = await User.find({}).populate({
        //     path: "validateLog",
        //     // select: { user: 0 },
        //     populate: {
        //         path: "animationID",
        //         // select: {
        //         //     validateLog: 0
        //         // }
        //     }
        // })
        const foundUser = await User.find({})
        res.json({ data: foundUser })
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Create New User
const createUser = async (req, res) => {
    const userData = req.body
    const newUser = new User(userData)

    try {
        await newUser.save()
        res.json(newUser)
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Get All user Log
const getUserLog = async (req, res) => {
    const { userID } = req.params
    try {
        const userLog = await ValidateLog.find({ userID: userID }).select({userID:0})
            .populate({
                path: "animationID",
                populate: {
                    path: "wordID"
                }
            })
        res.json({ userLog: userLog })
    } catch (error) {
        res.json({ message: error.message })
    }
}

module.exports = { getUser, createUser, getUserLog }