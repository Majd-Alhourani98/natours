// Import Express framework
const express = require('express');

// Import user controller functions to handle requests
const userController = require('./../controllers/user.controller');

// Create a new Express router instance
const router = express.Router();

// =======================
// USER ROUTES
// =======================

// Root route '/' for users
// GET    -> fetch all users
// POST   -> create a new user
router.route('/').get(userController.getAllUsers).post(userController.createUser);

// Parameterized route '/:id' for individual users
// GET    -> fetch a single user by ID
// PATCH  -> update a user by ID
// DELETE -> remove a user by ID
router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Export the router to be used in the main app
module.exports = router;
