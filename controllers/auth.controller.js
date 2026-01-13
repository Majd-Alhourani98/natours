const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created successfully! Welcome aboard.',
};

const signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password, passwordConfirm });

    user.password = hashedPassword;
    user.passwordConfirm = undefined;

    await user.save({ validateBeforeSave: false });

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
