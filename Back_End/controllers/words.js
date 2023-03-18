const { default: mongoose } = require("mongoose");
const Word = require("../models/Word");

// Get all word
const getWord = async (req, res) => {
  try {
    const foundWord = await Word.find({}).populate("animation", "file");
    res.json({ data: foundWord });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Search by word
const getWordBySearch = async (req, res) => {
  const { searchQuery } = req.query;
  const searchWord = new RegExp(searchQuery, "i");

  try {
    const foundWord = await Word.find({ word: searchWord });
    res.json({ data: foundWord });
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Create New Word
const createWord = async (req, res) => {
  const wordData = req.body;
  console.log("wordData");
  console.log(wordData);
  const newWord = new Word(wordData);

  try {
    await newWord.save();
    res.json(newWord);
  } catch (error) {
    res.json({ message: error.message });
  }
};

// Add Animation to Word
const addAnimation = async (req, res) => {
  const { wordID } = req.params;
  const { animationID } = req.body;

  if (!mongoose.Types.ObjectId.isValid(wordID)) {
    res.send("This is not objectID");
  } else {
    try {
      const addedAnimation = await Word.findByIdAndUpdate(
        { _id: wordID },
        { $push: { animation: animationID } },
        { new: true }
      );
      res.json(addedAnimation);
    } catch (error) {
      res.json({ message: error.message });
    }
  }
};

// Delete Selected word
const deleteWord = async (req, res) => {
  const { wordID } = req.params;
  const verifyWordID = mongoose.Types.ObjectId.isValid(wordID);
  if (!verifyWordID) {
    res.send("wordID is not ObjectID");
  } else {
    try {
      const deletedWord = await Word.findByIdAndDelete({ _id: wordID });
      if (deletedWord) {
        res.json(`Word "${deletedWord.word}" has been deleted`);
      } else {
        res.json("No word to delete");
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  }
};

module.exports = {
  getWordBySearch,
  getWord,
  createWord,
  addAnimation,
  deleteWord,
};
