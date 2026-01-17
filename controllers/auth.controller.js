const { nanoid, customAlphabet } = require("nanoid");

const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

const generateUniqueUsername = async (name) => {
  const base = name.replace(/\s+/g, "-").toLowerCase();
  let username = base;

  while (await User.findOne({ username }).lean()) {
    username = `${base}_${nanoidLetters()}`.toLowerCase();
  }

  return username;
};

const nanoidLetters = customAlphabet("abcdefghijklmnopqrstuvwxyz", 5);
const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const user = await User.create({
    email,
    name,
    password,
    passwordConfirm,
    username: await generateUniqueUsername(name),
  });

  sendResponse(res, { statusCode: 201, data: { user: user } });
});

module.exports = { signup };
