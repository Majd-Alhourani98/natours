const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { genereateToken, generateOtp } = require('../utils/crypto');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const { token, hashedToken, expiryToken } = genereateToken();
  const { otp, hashedOtp, expiryOtp } = generateOtp();

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: expiryToken,
    emailVerificationOTP: hashedOtp,
    emailVerificationOTPExpires: expiryOtp,
  });

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
    otp,
    token,
  });
});

module.exports = { signup };
