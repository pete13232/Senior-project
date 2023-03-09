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
        Word.deleteOne({ _id: req.params.wordID })
            .then(doc => {
                if(doc.deletedCount === 1){
                    res.json("Word deleted !")
                }else{
                    res.json("No word to delete")
                }
            })
            .catch(err => res.json(err))
    })



module.exports = router