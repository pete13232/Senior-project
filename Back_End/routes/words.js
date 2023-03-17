const express = require('express')
const router = express.Router()

const Word = require('../models/Word')
const { getWordBySearch, getWord, createWord, addAnimation, deleteWord } = require('../controllers/words')

// Get all word
router.route("/")
    .get(getWord)

// Create New Word
router.route("/add")
    .post(createWord)

// Add Animation to Word
router.route("/add/animation/:wordID")
    .put(addAnimation)

// Delete Selected word
router.route("/delete/:wordID")
    .delete(deleteWord)

// Search by word
router.route("/search")
    .get(getWordBySearch)



module.exports = router