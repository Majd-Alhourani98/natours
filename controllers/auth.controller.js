const { customAlphabet } = require('nanoid');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 9);

const AUTH = {
  SIGNUP_SUCCESS: 'Account created successfully! Welcome aboard.',
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const base = name.replace(/\s+/g, '-').toLowerCase();
  let username = `${base}-${nanoid()}`;

  while (await User.findOne({ username }).lean()) {
    username = `${username}-${nanoid()}`;
  }

  const user = await User.create({ name, email, password, passwordConfirm, username });

  res.status(201).json({
    status: 'success',
    message: AUTH.SIGNUP_SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
