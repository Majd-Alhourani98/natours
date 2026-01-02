const User = require('../models/user.model');
const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');
const catchAsync = require('../errors/handlers/catchAsyncHandler');
const { ValidationError } = require('../errors/classes/customClasses');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, verifyMethod = 'otp' } = req.body;

  if (verifyMethod !== 'otp' && verifyMethod !== 'link') {
    return next(new ValidationError('verifyMethod must be either `link` or `otp`'));
  }

  const user = new User({ name, email, password, passwordConfirm, isEmailVerified: false });

  let otp, token;
  if (verifyMethod === 'otp') {
    otp = user.createEmailVerificationOTP();
  } else if (verifyMethod === 'link') {
    token = user.createEmailVerificationToken();
  }

  await user.save();

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
