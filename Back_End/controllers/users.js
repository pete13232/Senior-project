const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const ValidateLog = require("../models/ValidateLog");
const { populate } = require("../models/Word");

// Get all user
const getUser = async (req, res) => {
    const role = res.locals.user.role
    if (role.includes('admin')) {
        try {
            const foundUser = await User.find({})
            res.status(200).json({ data: foundUser })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    } else {
        res.status(403).json({ errors: "You don't have permission" })
    }
}

// Create New User
const createUser = async (req, res) => {
    const userData = req.body
    const newUser = new User(userData)

    try {
        await newUser.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// Get All user Log
const getUserLog = async (req, res) => {
    const { userID } = req.params
    try {
        const userLog = await ValidateLog.find({ userID: userID }).select({ userID: 0 })
            .populate({
                path: "animationID",
                populate: {
                    path: "wordID"
                }
            })
        res.status(200).json({ userLog: userLog })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// Edit Selected User
const editUser = async (req, res) => {
    const { userID } = req.params
    const { password, firstName, lastName } = req.body
    const verifyUserID = mongoose.Types.ObjectId.isValid(userID);
    if (!verifyUserID) {
        res.status(400).json("userID isn't ObjectID");
    } else {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: userID },
                {
                    $set: {
                        password,
                        firstName,
                        lastName,
                    }
                },
                { new: true }
            );
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(200).json("No user edited");
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

// Delete Selected User
const deleteUser = async (req, res) => {
    const { userID } = req.query;
    const verifyUserID = mongoose.Types.ObjectId.isValid(userID);
    if (!verifyUserID) {
        res.status(400).send("userID is not ObjectID");
    } else {
        try {
            const deletedUser = await User.findByIdAndDelete({ _id: userID });
            if (deletedUser) {
                res.status(200).json(`User "${deletedUser.username}" has been deleted`);
            } else {
                res.status(200).json("No user has been delete");
            }
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
};

module.exports = { getUser, createUser, getUserLog, editUser, deleteUser }