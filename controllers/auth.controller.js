const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const user = await User.create({
    email,
    name,
    password,
    passwordConfirm,
  });

  sendResponse(res, { statusCode: 201, data: { user: user } });
});

module.exports = { signup };
