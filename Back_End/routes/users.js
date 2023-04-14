const express = require('express')
const router = express.Router()
const { getUser, createUser, getUserLog, editUser, deleteUser } = require('../controllers/users')
const { requireAuth, checkPermission } = require('../middleware/authMiddleware')

// Get all user
router.route("/users")
    .get([requireAuth, checkPermission(['admin'])], getUser)

// Create New User
router.route("/users/add")
    .post([requireAuth, checkPermission(['admin'])], createUser)

// Delete Selected User
router.route("/users/delete")
    .delete([requireAuth, checkPermission(['admin'])], deleteUser)

// Get All user Log
router.route("/users/validateLog/:userID")
    .get([requireAuth, checkPermission(['admin', 'specialist'])], getUserLog)

// Edit Selected User
router.route("/users/:userID")
    .patch([requireAuth, checkPermission(['admin', 'specialist'])], editUser)


module.exports = router