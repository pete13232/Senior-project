const { default: mongoose } = require("mongoose");
const Word = require("../models/Word");
const Animation = require('../models/Animation');
const upload = require('../middleware/multer');

// Get all word
const getWord = async (req, res) => {
  try {
    const foundWord = await Word.find({});
    res.status(200).json({ data: foundWord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get Word by ID
const getWordByID = async (req, res) => {
  const { wordID } = req.params;

  try {
    const word = await Word.findById({ _id: wordID });
    res.status(200).json({ data: word });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Search by word
const getWordBySearch = async (req, res) => {
  const { word } = req.query;
  const searchWord = new RegExp(word, "i");
  try {
    const foundWord = await Word.find({ word: searchWord });
    res.status(200).json({ data: foundWord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Create New Word
const createWord = async (req, res) => {
  await upload.uploadLocalMiddleware(req, res)
  const { word, description } = req.body;
  const newWord = new Word({ word, description });

  try {
    await newWord.save();
    res.status(201).json(newWord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add Animation to Word
// const addAnimation = async (req, res) => {
//   const { wordID } = req.params;
//   const { animationID } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(wordID)) {
//     res.status(400).json("This is not objectID");
//   } else {
//     try {
//       const addedAnimation = await Word.findByIdAndUpdate(
//         { _id: wordID },
//         { $push: { animation: animationID } },
//         { new: true }
//       );
//       res.status(200).json(addedAnimation);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// };

// Edit Selected Word
const editWord = async (req, res) => {
  const { wordID } = req.params
  await upload.uploadLocalMiddleware(req, res)
  const { word, description } = req.body
  const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  if (!verifyWordID) {
    res.status(400).json("wordID isn't ObjectID");
  } else {
    try {
      const updatedWord = await Word.findByIdAndUpdate(
        { _id: wordID },
        {
          $set: {
            word,
            description,
          }
        },
        { new: true }
      );
      if (updatedWord) {
        res.status(200).json(updatedWord);
      } else {
        res.status(200).json("No word edited");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

// Delete Selected word
const deleteWord = async (req, res) => {
  const { wordID } = req.params;
  const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  if (!verifyWordID) {
    res.status(400).send("wordID is not ObjectID");
  } else {
    try {
      const relatedAnimation = await Animation.deleteMany({ wordID: wordID })
      const deletedWord = await Word.findByIdAndDelete({ _id: wordID });
      if (deletedWord && relatedAnimation) {
        res.status(200).json(`Word "${deletedWord.word}" and related animation has been deleted`);
      } else if (deletedWord) {
        res.status(200).json(`Word "${deletedWord.word}" has been deleted`);
      } else {
        res.status(200).json("No word to delete");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = {
  getWordBySearch,
  getWord,
  createWord,
  deleteWord,
  getWordByID,
  editWord
};
