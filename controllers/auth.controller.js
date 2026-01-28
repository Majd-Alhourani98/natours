const { BadRequestError, ConflictError } = require('../errors/AppError');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const sendResponse = require('../utils/sendResponse');

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm, verifyMethod = 'otp' } = req.body;

  if (!['otp', 'link'].includes(verifyMethod))
    return next(new BadRequestError('verifyMethod must be either `link` or `otp`'));

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ConflictError('Email already in use'));

  const user = new User({ email, name, password, passwordConfirm, isEmailVerified: false });

  const credentials = user.setupVerification(verifyMethod);

  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text:
        verifyMethod === 'link'
          ? `Link: ${process.env.FRONTEND_URL}/verify?token=${credentials.token}&email=${user.email}`
          : `OTP: ${credentials.otp}`,
    });
  } catch (error) {
    user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  const message =
    verifyMethod === 'otp'
      ? 'Registration successful! Please check your email for the verification OTP.'
      : 'Registration successful! A verification link has been sent to your email.';

  sendResponse(res, {
    statusCode: 201,
    message,
    data: { user, otp: credentials.otp, token: credentials.token },
  });
});

module.exports = { signup };
