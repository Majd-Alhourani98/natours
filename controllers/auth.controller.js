const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const { generateToken, generateOtp } = require("../utils/crypto");
const sendResponse = require("../utils/sendResponse");

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const { token, hashedToken, tokenExpires } = generateToken();
  const { otp, hashedOtp, otpExpires } = generateOtp();

  const user = await User.create({
    email,
    name,
    password,
    passwordConfirm,
    isEmailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: tokenExpires,
    emailVerificationOTP: hashedOtp,
    emailVerificationOTPExpires: otpExpires,
  });

  sendResponse(res, { statusCode: 201, data: { user: user, otp, token } });
});

module.exports = { signup };
