const express = require('express')
const router = express.Router()

const Word = require('../models/Word')

router.route("/")
    .get((req, res) => {
        // Change _id from ObjectID to String as "wordID"
        Word.aggregate().addFields({
            wordID: {
                $toString: '$_id'
            }
        }).lookup({
            from: 'animations',
            localField: 'wordID',
            foreignField: 'wordID',
            as: 'animation'
        }).exec((err, result) => {
            if (result) {
                res.send(result)
            } else {
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        const newWord = new Word({
            wordName: req.body.wordName,
            description: req.body.description,
        })
        newWord.save((err) => {
            if (!err) {
                res.send("successfully added a new Word.")
            } else {
                res.send(err)
            }
        })
    })

router.route("/:wordName")
    .get((req, res) => {
        Word.findOne({ wordName: req.params.wordName }, (err, foundWord) => {
            if (!err) {
                res.json(foundWord)
            } else {
                res.send("No word matching the word name")
            }
        })
    })

module.exports = router