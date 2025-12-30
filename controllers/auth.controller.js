const User = require('../models/user.model');
const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');
const catchAsync = require('../errors/handlers/catchAsyncHandler');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = new User({
    name,
    email,
    password,
    passwordConfirm,
    isEmailVerified: false,
  });

  const token = user.generateToken();
  const otp = user.generateOTP();

  user.save();

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
    token,
    otp,
  });
});

module.exports = { signup };
