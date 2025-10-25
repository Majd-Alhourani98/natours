const express = require('express');
const userController = require('./../controllers/user.controller');

const router = express.Router();

// --- Users Routes (Placeholder Implementation) ---
// This router handles all user-related routes. Currently, all controllers
// are placeholders returning a 500 error. Once implemented, these routes
// will include proper validation, authentication, and database interaction.
// Mounted in app.js under /api/v1/users

// @route   GET  /api/v1/users
// @route   POST /api/v1/users
// @desc    Retrieve all users or create a new user
router
  .route('/')
  .get(userController.getAllUsers) // Fetch all users (placeholder)
  .post(userController.createUser); // Create a new user (placeholder)

// @route   GET    /api/v1/users/:id
// @route   PATCH  /api/v1/users/:id
// @route   DELETE /api/v1/users/:id
// @desc    Retrieve, update, or delete a specific user by ID
router
  .route('/:id')
  .get(userController.getSingleUser) // Fetch user by ID (placeholder)
  .patch(userController.updateUser) // Update user by ID (placeholder)
  .delete(userController.deleteUser); // Delete user by ID (placeholder)

// --- Module Exports ---
// Export router for mounting in main application (server.js or app.js)
module.exports = router;
