const express = require('express')
const router = express.Router()

const Word = require('../models/Word')

router.route("/")
    .get((req, res) => {
        Word.find({}).populate('animation', 'file').then((success, err) => {
            if (success) {
                console.log(success[0])
                res.send(success)
            }
            else {
                res.send(err)
            }
        })
    })

// Create New Word
router.route("/add")
    .post((req, res) => {
        const newWord = new Word({
            word: req.body.word,
            description: req.body.description,
            animation: []
        })
        newWord.save().then((success, err) => {
            if (success) res.send(success)
            else res.send(err)
        })
    })

// Add Animation to Word
router.route("/add/animation/:wordID")
    .put((req, res) => {
        Word.findByIdAndUpdate({ _id: req.params.wordID }, { $push: { animation: req.body.animationID } }, { new: true }).then((doc, err) => {
            if (doc) res.send(doc)
            else res.json(err)
        })
    })

// Delete Selected word
router.route("/delete/:wordID")
    .delete((req, res) => {
        Word.deleteOne({ _id: req.params.wordID }, (err, result) => {
            if (!err) {
                res.send("Word Deleted successfully!")
            } else if (result.deletedCount == 0) {
                res.send("No word you looking for to deleted !")
            } else {
                res.send(err)
            }
        })
    })



module.exports = router