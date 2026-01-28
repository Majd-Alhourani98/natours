const { BadRequestError, ConflictError } = require('../errors/AppError');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { sendVerificationEmail } = require('../utils/email');
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
    await sendVerificationEmail({ to: user.email, verifyMethod, credentials });
  } catch (error) {
    console.log('hitting');
    user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  sendResponse(res, {
    statusCode: 201,
    message:
      verifyMethod === 'otp'
        ? 'Registration successful! Please check your email for the verification OTP.'
        : 'Registration successful! A verification link has been sent to your email.',
    data: { user },
  });
});

module.exports = { signup };
