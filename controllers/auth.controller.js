const User = require('../models/user.model');
const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');
const catchAsync = require('../errors/handlers/catchAsyncHandler');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({ name, email, password, passwordConfirm });

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
