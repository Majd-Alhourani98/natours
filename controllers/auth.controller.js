const User = require('../models/user.model');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created successfully! Welcome aboard.',
};

const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);

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
