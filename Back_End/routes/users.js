const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.route("/")
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

module.exports = router