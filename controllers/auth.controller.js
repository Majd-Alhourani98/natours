const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created! Please check your email to verify your account.',
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = new User({ name, email, password, passwordConfirm });

  const otp = user.generateEmailVerificationOtp();
  await user.save();

  res.status(201).json({
    status: 'success',
    message: AUTH.SIGNUP_SUCCESS,
    data: { user },
    otp,
  });
});

module.exports = { signup };
