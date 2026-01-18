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

  let token,
    otp,
    verifyMethod = "otp";

  if (verifyMethod === "otp") {
    otp = user.generateEmailVerificationOtp();
  } else if (verifyMethod == "link") {
    token = user.generateEmailVerificationToken();
  }

  await user.save();

  sendResponse(res, { statusCode: 201, data: { user: user, otp, token } });
});

module.exports = { signup };
