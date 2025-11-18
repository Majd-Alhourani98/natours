const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const sendSuccess = require('../utils/responseHandler');
const HTTP_STATUS = require('./../constants/httpStatus');
const catchAsync = require('./../utils/catchAsync');
const env = require('./../config/env.config');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = jwt.sign({ id: user._id }, env.JWT.SECRET, {
    expiresIn: env.JWT.EXPIRES_IN,
  });

  user.password = undefined;

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    data: { user },
    token,
  });
});

module.exports = {
  signup,
};
