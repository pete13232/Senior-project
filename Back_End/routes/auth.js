const express = require('express')
const router = express.Router()
const {signup_post, login_post} = require('../controllers/authController')

router.route('/signup')
    .get((req,res)=>{
        res.send("You are log in")
    })
    .post(signup_post)

router.route('/login')
    .get()
    .post()

router.route('/logout')
    .get()

module.exports = router