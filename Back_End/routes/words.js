const express = require('express')
const router = express.Router()

const Word = require('../models/Word')
const { getWordBySearch, getWord, createWord, addAnimation, deleteWord } = require('../controllers/words')

// Get all word
router.route("/words")
    .get(getWord)

// Create New Word
router.route("/words/add")
    .post(createWord)

// Add Animation to Word
router.route("/words/add/animation/:wordID")
    .put(addAnimation)

// Delete Selected word
router.route("/words/delete/:wordID")
    .delete(deleteWord)

// Search by word
router.route("/words/search")
    .get(getWordBySearch)



module.exports = router