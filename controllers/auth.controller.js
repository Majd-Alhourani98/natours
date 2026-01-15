const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { genereateToken, generateOtp } = require('../utils/crypto');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({ name, email, password, passwordConfirm });

  const token = user.generateEmailVerificationToken();
  const otp = user.generateEmailVerificationOtp();

  await user.save({ validateBeforeSave: false });

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
    otp,
    token,
  });
});

module.exports = { signup };
