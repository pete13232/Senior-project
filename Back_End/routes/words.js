const express = require('express')
const router = express.Router()

const { getWordBySearch, getWord, createWord, addAnimation, deleteWord, getWordByID, editWord } = require('../controllers/words')
const { requireAuth, checkPermission } = require('../middleware/authMiddleware')

// Get all word
router.route("/words")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getWord)

// Search by word
router.route("/words/search")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getWordBySearch)

// Create New Word
router.route("/words/add")
    .post([requireAuth, checkPermission(['admin'])], createWord)

// Add Animation to Word
router.route("/words/add/animation/:wordID")
    .put([requireAuth, checkPermission(['admin'])], addAnimation)

// Delete Selected word
router.route("/words/delete/:wordID")
    .delete([requireAuth, checkPermission(['admin'])], deleteWord)

// Get word By ID 
router.route("/words/:wordID")
    .get([checkPermission(['admin', 'specialist', 'guest'])], getWordByID)
    .patch([requireAuth, checkPermission(['admin', 'specialist'])], editWord) // Edit Selected Word


module.exports = router