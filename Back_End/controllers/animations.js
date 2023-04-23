const { default: mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");
const Animation = require("../models/Animation");
const User = require("../models/User");
const ValidateLog = require("../models/ValidateLog");
const Word = require("../models/Word");

// Get All Animation
const getAnimation = async (req, res) => {
  try {
    const foundAnimation = await Animation.find({}).populate('wordID')

    res.status(200).json({ data: foundAnimation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Animation by wordID
const getAnimationByWordID = async (req, res) => {
  const { wordID } = req.query;

  try {
    let animation
    if (wordID) {
      console.log(wordID)
      animation = await Animation.find({ wordID: wordID });
    }
    res.status(200).json({ data: animation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get Animation by ID
const getAnimationByID = async (req, res) => {
  const { animationID } = req.params;

  try {
    const animation = await Animation.findById({ _id: animationID });
    res.status(200).json({ data: animation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}


// Create New Animation
const createAnimation = async (req, res) => {
  const { wordID } = req.query
  // const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  const wordID_exist = await Word.countDocuments({ _id: wordID })

  if (wordID_exist > 0) {
    const newAnimation = new Animation({
      wordID: wordID,
      file: "http://localhost:3333/file/" + req.file.filename,
    });
    try {
      await newAnimation.markModified("file");
      await newAnimation.save();
      res.status(201).json(newAnimation);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(400).json("invalid wordID")
  }
};

const updateValidateLog_get = (req, res) => {
  res.render('animation')
}

// Validate Animation
const updateValidateLog = async (req, res) => {
  const { animationID } = req.params;
  const userID = res.locals.user._id
  const { validateStat } = req.body;
  const verifyUserID = mongoose.Types.ObjectId.isValid(userID);
  const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID);

  const newValidateLog = new ValidateLog({
    animationID: animationID,
    userID: userID,
    validateStat: validateStat,
  });

  if (!(verifyUserID && verifyAnimationID)) {
    res.status(400).json("userID or animationID isn't ObjectID");
  } else {
    try {
      const validateLog = await newValidateLog.save();
      if (validateLog) {
        const count = await User.countDocuments({ _id: userID });

        if (count > 0) {
          await User.findByIdAndUpdate(
            { _id: userID },
            { $push: { validateLog: validateLog._id } }
          );
          await Animation.findByIdAndUpdate(
            { _id: animationID },
            { $set: { validateLog: validateLog._id } }
          );
          res.status(200).json(validateLog);
        } else {
          res.status(404).json("userID doesn't exist");
        }
      } else {
        res.status(400).json("Can't add validateLog to user or animation");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

// Delete Selected Animation
const deleteAnimation = async (req, res) => {
  const { animationID } = req.params;
  const verifyAnimationID = mongoose.Types.ObjectId.isValid(animationID);
  if (!verifyAnimationID) {
    res.status(400).json("animationID isn't ObjectID");
  } else {
    try {
      const deletedAnimation = await Animation.findByIdAndDelete({
        _id: animationID,
      });
      if (deletedAnimation) {
        res.status(200).json(`Animation "${deleteAnimation.word}" has been deleted`);
      } else {
        res.status(200).json("No animation deleted");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

// Get All animation validate log
const getAnimationLog = async (req, res) => {
  const { animationID } = req.params
  try {
    const animationLog = await ValidateLog.find({ animationID: animationID }).select({ animationID: 0 })
      .populate({
        path: "userID",
      })

    res.status(200).json({ animationLog: animationLog })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

module.exports = {
  getAnimation,
  createAnimation,
  updateValidateLog,
  deleteAnimation,
  getAnimationLog,
  getAnimationByID,
  getAnimationByWordID,
  updateValidateLog_get
};
