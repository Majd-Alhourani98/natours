const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = new User({ name, email, password, passwordConfirm });

  const verifyMethod = 'otp';
  let token, otp;

  if (verifyMethod === 'otp') {
    otp = user.generateEmailVerificationOtp();
  } else if (verifyMethod === 'link') {
    token = user.generateEmailVerificationToken();
  }

  await user.save();

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    message:
      verifyMethod === 'otp'
        ? 'Signup successful! An OTP has been sent to your email.'
        : 'Signup successful! A verification link has been sent to your email.',

    data: { user },
    otp,
    token,
  });
});

module.exports = { signup };
