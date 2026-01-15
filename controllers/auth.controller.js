const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = new User({ name, email, password, passwordConfirm });

  const token = user.generateEmailVerificationToken();
  const otp = user.generateEmailVerificationOtp();

  await user.save();

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
    otp,
    token,
  });
});

module.exports = { signup };
