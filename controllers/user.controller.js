const User = require('./../models/user.model');
const HTTP_STATUS = require('./../constants/httpStatus');
const sendSuccess = require('./../utils/responseHandler');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// =======================
// USERS CONTROLLERS (PLACEHOLDERS)
// =======================

// All user-related routes currently return a 500 error
// indicating that the functionality is not yet implemented

// GET /api/v1/users - fetch all users
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  sendSuccess(res, {
    message: 'users retrieved successfully',
    data: { users },
  });
});

// GET /api/v1/users/:id - fetch a single user by ID
const getSingleUser = (req, res) =>
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });

// POST /api/v1/users - create a new user
const createUser = (req, res) =>
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });

// PATCH /api/v1/users/:id - update an existing user
const updateUser = (req, res) =>
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });

// DELETE /api/v1/users/:id - delete a user
const deleteUser = (req, res) =>
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });

// Export all controller functions for use in routes
module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
