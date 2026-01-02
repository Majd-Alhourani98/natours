const User = require('../models/user.model');
const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');
const catchAsync = require('../errors/handlers/catchAsyncHandler');
const { ValidationError } = require('../errors/classes/customClasses');
const { sendEmail } = require('../services/email.service');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, verifyMethod = 'otp' } = req.body;

  if (verifyMethod !== 'otp' && verifyMethod !== 'link') {
    return next(new ValidationError('verifyMethod must be either `link` or `otp`'));
  }

  const user = new User({ name, email, password, passwordConfirm, isEmailVerified: false });

  let otp, token;
  if (verifyMethod === 'otp') {
    q;
    otp = user.createEmailVerificationOTP();
  } else if (verifyMethod === 'link') {
    token = user.createEmailVerificationToken();
  }

  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text:
        verifyMethod === 'otp'
          ? `Your OTP from email verification is: ${otp}`
          : `Click this link to verify your email: ${process.env.FRONTEND_URL}api/v1/verify-email?token=${token}&email=${user.email} `,
    });
  } catch (error) {
    user.rollbackEmailVerification();
    await user.save({ validateBeforeSave: false });
  }

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    message:
      verifyMethod === 'otp'
        ? 'Signup successful! An OTP has been sent to your email.'
        : 'Signup successful! A verification link has been sent to your email.',

    data: { user },
    token,
    otp,
  });
});

module.exports = { signup };
