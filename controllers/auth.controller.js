const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;
  const user = await User.create({ email, name, password, passwordConfirm });

  user.password = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  emailVerificationOTP = undefined;
  emailVerificationOTPExpires = undefined;

  sendResponse(res, { data: { user } });
});

module.exports = { signup };
