const express = require('express')
const router = express.Router()
const { getUser, createUser, getUserLog, editUser, deleteUser } = require('../controllers/users')
const { requireAuth } = require('../middleware/authMiddleware')

// Get all user
router.route("/users")
    .get(requireAuth, getUser)


// Create New User
router.route("/users/add")
    .post(createUser)

// Delete Selected User
router.route("/users/delete")
    .delete(deleteUser)

// Get All user Log
router.route("/users/validateLog/:userID")
    .get(getUserLog)

// Edit Selected User
router.route("/users/:userID")
    .patch(editUser)


module.exports = router