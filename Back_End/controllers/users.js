const User = require("../models/User");

// Get all user
const getUser = async (req, res) => {
    try {
        const foundUser = await User.find({}).populate({
            path: "validateLog",
            select: { user: 0 },
            populate: {
                path: "animation",
                select: {
                    validateLog: 0
                }
            }
        })
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
        res.json({message: error.message})
    }
}

module.exports = {getUser, createUser}