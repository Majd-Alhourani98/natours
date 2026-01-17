const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const sanitizeUser = require("../utils/sanitizeUser");
const sendResponse = require("../utils/sendResponse");

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;
  const user = await User.create({ email, name, password, passwordConfirm });

  const cleanedUser = sanitizeUser(user);

  sendResponse(res, { data: { user: cleanedUser } });
});

module.exports = { signup };
