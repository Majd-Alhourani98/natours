const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created successfully! Welcome aboard.',
};

/**
 * ⚠️ ARCHITECTURAL PROBLEM:
 * 1. This approach saves the user TWICE (User.create then user.save).
 * 2. If the server crashes after .create() but before .save(),
 * the plain-text password remains in the database.
 */

const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.create({ name, email, password, passwordConfirm });

    user.password = await bcrypt.hash(user.password, 12);
    user.passwordConfirm = undefined;

    user.save({ validateBeforeSave: false });

    res.status(201).json({
      status: 'success',
      message: AUTH.SIGNUP_SUCCESS,
      data: { user: user },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

module.exports = { signup };
