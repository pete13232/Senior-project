const express = require('express')
const router = express.Router()
const { signup_post, login_post, signupAdmin_post } = require('../controllers/authController')

router.route('/signup')
    .post(signup_post)

router.route('/signup/admin')
    .get(signupAdmin_post)

router.route('/login')
    .post(login_post)

module.exports = router