const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const sendSuccess = require('../utils/responseHandler');
const HTTP_STATUS = require('./../constants/httpStatus');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const generateToken = require('../utils/tokens');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = generateToken(user._id);

  user.password = undefined;

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    data: { user },
    token,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', HTTP_STATUS.BAD_REQUEST));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isCorrectPassword(password))) {
    return next(new AppError('Incorrect email or password', HTTP_STATUS.UNAUTHORIZED));
  }

  // 3) if everthing ok, send token to client
  const token = generateToken(user._id);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.ok,
    token,
  });
});

module.exports = {
  signup,
  login,
};
