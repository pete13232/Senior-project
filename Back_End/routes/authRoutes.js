const express = require('express')
const router = express.Router()
const { signup_post, login_post, signup_get, login_get, logout_get, signupAdmin_post } = require('../controllers/authController')
const { route } = require('./animations')

router.route('/signup')
    .get(signup_get)
    .post(signup_post)

router.route('/signup/admin')
    .get(signupAdmin_post)

router.route('/login')
    .get(login_get)
    .post(login_post)

router.route('/logout')
    .get(logout_get)

module.exports = router