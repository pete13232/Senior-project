const ValidateLog = require("../models/ValidateLog")

// get log
const getLog = async (req, res) => {
    try {
        const foundLog = await ValidateLog.find({}).populate({
            path: "animationID",
        }).populate({
            path: "userID"
        })
        res.json({ log: foundLog })
    } catch (err) {
        res.json({ message: err.message });
    }
}

module.exports = { getLog }