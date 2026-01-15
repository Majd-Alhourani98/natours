const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { generateOtp } = require('../utils/crypto');
const generateNanoId = require('../utils/nanoid');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created! Please check your email to verify your account.',
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const { otp, hashedOtp, otpExpires } = generateOtp();
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    emailVerificationOTP: hashedOtp,
    emailVerificationOTPExpires: otpExpires,
  });

  res.status(201).json({
    status: 'success',
    message: AUTH.SIGNUP_SUCCESS,
    data: { user },
    otp,
  });
});

module.exports = { signup };
