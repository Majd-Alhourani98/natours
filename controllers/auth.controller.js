const User = require('../models/user.model');
const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');
const catchAsync = require('../errors/handlers/catchAsyncHandler');
const { ValidationError, ConflictError, NotFoundError } = require('../errors/classes/customClasses');
const { sendVerificationEmail } = require('../services/email.service');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, verifyMethod = 'otp' } = req.body;

  if (verifyMethod !== 'otp' && verifyMethod !== 'link') {
    return next(new ValidationError('verifyMethod must be either `link` or `otp`'));
  }

  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) return next(new ConflictError('Email already is use'));

  const user = new User({ name, email, password, passwordConfirm, isEmailVerified: false });

  let otp, token;
  if (verifyMethod === 'otp') {
    otp = user.createEmailVerificationOTP();
  } else if (verifyMethod === 'link') {
    token = user.createEmailVerificationToken();
  }

  await user.save();

  try {
    await sendVerificationEmail({ email: user.email, verifyMethod, otp, token });
  } catch (error) {
    user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  return res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    message:
      verifyMethod === 'otp'
        ? 'Signup successful! An OTP has been sent to your email.'
        : 'Signup successful! A verification link has been sent to your email.',

    data: { user },
  });
});

const resendVerification = catchAsync(async (req, res, next) => {
  const { email, verifyMethod = 'otp' } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new NotFoundError('User not found with this email'));

  if (user.isEmailVerified)
    return res.status(httpStatus.OK).json({
      status: responseStatus.SUCCESS,
      message: 'Email is already verified.',
    });

  const now = Date.now();
  const RESEND_DELAY_MS = 30 * 1000;
  if (user.lastVerificationEmailSentAt && now - user.lastVerificationEmailSentAt.getTime() < RESEND_DELAY_MS) {
    const remainingSeconds = Math.ceil((RESEND_DELAY_MS - (now - user.lastVerificationEmailSentAt.getTime())) / 1000);
    return res.status(httpStatus.TOO_MANY_REQUESTS).json({
      status: responseStatus.ERROR,
      message: `Please wait ${remainingSeconds} seconds before requesting another verification email.`,
    });
  }

  if (
    user.emailVerificationOTP ||
    user.emailVerificationOTPExpires ||
    user.emailVerificationToken ||
    user.emailVerificationTokenExpires
  ) {
    user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  let otp, token;
  if (verifyMethod === 'otp') {
    otp = user.createEmailVerificationOTP();
  } else if (verifyMethod === 'link') {
    token = user.createEmailVerificationToken();
  }

  user.lastVerificationEmailSentAt = Date.now();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail({ email: user.email, verifyMethod, otp, token });
  } catch (error) {
    user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  return res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    message:
      verifyMethod === 'otp'
        ? 'Signup successful! An OTP has been sent to your email.'
        : 'Signup successful! A verification link has been sent to your email.',

    data: { user },
  });
});

module.exports = { signup, resendVerification };
