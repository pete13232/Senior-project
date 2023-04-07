const ValidateLog = require("../models/ValidateLog")

const getLog = async (req, res) => {
    try {
        const foundLog = await ValidateLog.find({}).populate('animationID')
    } catch (err) {
        res.json({ message: err.message });
    }
}

module.exports = {getLog}