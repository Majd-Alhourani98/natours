const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const nanoidLetters = require('../utils/nanoidLetters');

const generateUniqueUsername = async (name) => {
  const base = name.replace(/\s+/g, '-').toLowerCase();
  let username = base;

  while (await User.findOne({ username }).lean()) {
    username = `${base}_${nanoidLetters()}`.toLowerCase();
  }

  return username;
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const username = await generateUniqueUsername(name);

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    username,
  });

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
