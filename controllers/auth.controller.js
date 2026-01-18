const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const { generateToken, generateOtp } = require("../utils/crypto");
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

module.exports = { signup };
