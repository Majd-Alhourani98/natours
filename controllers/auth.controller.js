const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const user = new User({
    email,
    name,
    password,
    passwordConfirm,
    isEmailVerified: false,
  });

  const token = user.generateEmailVerificationToken();
  const otp = user.generateEmailVerificationOtp();

  await user.save();

  sendResponse(res, { statusCode: 201, data: { user: user, otp, token } });
});

const signupWithOtp = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const user = new User({
    email,
    name,
    password,
    passwordConfirm,
    isEmailVerified: false,
  });

  const otp = user.generateEmailVerificationOtp();

  await user.save();

  sendResponse(res, {
    statusCode: 201,
    message:
      "Signup successful! Please verify using the OTP sent to your email.",
    data: { user: user, otp },
  });
});

const signupWithToken = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const user = new User({
    email,
    name,
    password,
    passwordConfirm,
    isEmailVerified: false,
  });

  const token = user.generateEmailVerificationToken();

  await user.save();

  sendResponse(res, {
    statusCode: 201,
    message: "Signup successful! Please verify your email via the link.",
    data: { user: user, token },
  });
});

module.exports = { signup, signupWithOtp, signupWithToken };
