const express = require('express')
const router = express.Router()
const {signup_post, login_post, signup_get} = require('../controllers/authController')

router.route('/signup')
    .get(signup_get)
    .post(signup_post)

router.route('/login')
    .get()
    .post()

router.route('/logout')
    .get()

module.exports = router