//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.set('strictQuery', true)
// app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/tslDB", { useNewUrlParser: true })

// Create Schema (Collection)
const wordSchema = {
    wordName: String,
    description: String
}

const AnimationSchema = {
    wordID: String,
    fileURL: String,
    lastValidateUserID: String,
    validateStatus: Boolean,
}

const UserSchema = {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    role: {
        type: String,
        enum: ['guest', 'specialist', 'admin'],
        default: 'guest'
    }
}


// Create Model (Compiled from Schema, instance of model is "Document")
const Word = mongoose.model("Word", wordSchema)
const Animation = mongoose.model("Animation", AnimationSchema)
const User = mongoose.model("User", UserSchema)

//TODO

////////////////////////// Request Targetting A Article ////////////////////////
app.route("/users")
    .get((req, res) => {
        User.aggregate().addFields({
            userID: {
                $toString: '$_id'
            }
        }).lookup({
            from: 'animations',
            localField: 'userID',
            foreignField: 'lastValidateUserID',
            as: 'animation'
        }).project({
            _id: 0
        }).exec((err,result) => {
            if(result){
                res.send(result)
            }else{
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        const newUser = User({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role
        })
        newUser.save((err) => {
            if (!err) {
                res.send("successfully added a new User.")
            } else {
                res.send(err)
            }
        })
    })


app.route("/words")
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


app.route("/animations/:wordID")
    .get((req, res) => {

    })
    .post((req, res) => {
        const newAnimation = new Animation({
            wordID: req.params.wordID,
            lastValidateUserID: req.body.lastValidateUserID,
            validateStatus: req.body.validateStatus,
        })
        newAnimation.save((err) => {
            if (!err) {
                res.send("Create Animation Successfull")
            } else {
                res.send(err)
            }
        })
    })

// Specific Word
app.route("/words/:wordName")
    .get((req, res) => {
        Word.findOne({ wordName: req.params.wordName }, (err, foundWord) => {
            if (!err) {
                res.json(foundWord)
            } else {
                res.send("No word matching the word name")
            }
        })
    })

app.listen(3333, function () {
    console.log("Server started on port 3333");
});