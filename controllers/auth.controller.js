const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const sendSuccess = require('../utils/responseHandler');
const HTTP_STATUS = require('./../constants/httpStatus');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const generateToken = require('../utils/tokens');
const sendEmail = require('./../utils/email');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({ name, email, password, passwordConfirm });

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

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on Posted email
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError('there is no user with email address', HTTP_STATUS.NOT_FOUND));

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) send email to the user
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCHa request with your new password and password Confirm to :${resetURL}.\n If you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message,
    });

    sendSuccess(res, {
      statusCode: HTTP_STATUS.ok,
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
});

const resetPassword = () => {};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
};
