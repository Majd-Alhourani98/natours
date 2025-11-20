const HTTP_STATUS = require('./../constants/httpStatus');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const env = require('./../config/env.config');
const User = require('./../models/user.model');

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token from headers OR cookies
  let token = null;

  // From Authorization header
  if (req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // From cookie
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  console.log(token);
  // 2) Verification token
  const decoded = jwt.verify(token, env.JWT.SECRET);

  // 3) Check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token no longer exists. Please log in again.',
        HTTP_STATUS.UNAUTHORIZED
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (user.isChangedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', HTTP_STATUS.UNAUTHORIZED)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', HTTP_STATUS.FORBIDDEN)
      );
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
