const ValidateLog = require("../models/ValidateLog")

const getLog = async (req, res) => {
    try {
        const foundLog = await ValidateLog.find({}).populate('animationID')
    } catch (error) {
        
    }
}

module.exports = {getLog}