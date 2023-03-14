const express = require('express')
const router = express.Router()

const Word = require('../models/Word')

router.route("/")
    .get((req, res) => {
        Word.find({}).populate("animation", 'file')
            .then(doc => res.json(doc))
            .catch(err => res.json(err))
    })

// Create New Word
router.route("/add")
    .post((req, res) => {
        const newWord = new Word({
            word: req.body.word,
            description: req.body.description,
            animation: []
        })
        newWord.save()
            .then(doc => res.json(doc))
            .catch(err => res.json(err))
    })

// Add Animation to Word
router.route("/add/animation/:wordID")
    .put((req, res) => {
        Word.findByIdAndUpdate({ _id: req.params.wordID }, { $push: { animation: req.body.animationID } }, { new: true })
            .then(doc => res.json(doc))
            .catch(err => res.json(err))
    })

// Delete Selected word
router.route("/delete/:wordID")
    .delete((req, res) => {
        const wordID = req.params.wordID
        Word.deleteOne({ _id: wordID })
            .then(doc => {
                if (doc.deletedCount === 1) {
                    res.json("Word deleted !")
                } else {
                    res.json("No word to delete")
                }
            })
            .catch(err => res.json(err))
    })

router.route("/search")
    .get((req, res) => {
        const searchQuery = req.query.searchQuery
        const searchWord = new RegExp(searchQuery, 'i')
        try {
            const word = Word.find({ word: searchWord })
                .then(doc => res.json(doc))
        } catch (error) {
            res.json({message: error.message})
        }
    })



module.exports = router