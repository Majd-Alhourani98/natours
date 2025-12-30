const User = require('../models/user.model');
const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');
const catchAsync = require('../errors/handlers/catchAsyncHandler');
const { generateToken, generateOTP } = require('../utils/crypto');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const { token, hashedToken, tokenExpires } = generateToken();
  const { otp, hashedOtp, otpExpires } = generateOTP();

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    isEmailVerified: false,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpire: tokenExpires,
    emailVerificationOTP: hashedOtp,
    emailVerificationTokenExpire: otpExpires,
  });

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
    token,
    otp,
  });
});

module.exports = { signup };
