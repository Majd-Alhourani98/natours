const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created successfully! Welcome aboard.',
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({ name, email, password, passwordConfirm });

  res.status(201).json({
    status: 'success',
    message: AUTH.SIGNUP_SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
