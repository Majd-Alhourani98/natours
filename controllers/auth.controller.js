const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const generateNanoId = require('../utils/nanoid');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created successfully! Welcome aboard.',
};

const generateUsername = async name => {
  const base = name.replace(/\s+/g, '-').toLowerCase();
  let username = `${base}-${generateNanoId()}`;

  while (await User.findOne({ username }).lean()) {
    username = `${base}-${generateNanoId()}`;
  }

  return username;
};

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const username = await generateUsername(name);
  const user = await User.create({ name, email, password, passwordConfirm, username });

  res.status(201).json({
    status: 'success',
    message: AUTH.SIGNUP_SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
