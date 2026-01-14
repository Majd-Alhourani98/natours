const httpStatus = require('../constants/httpStatus');
const responseStatus = require('../constants/responseStatus');

const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const sanitizeUser = require('../utils/sanitizeUser');

const signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({ name, email, password, passwordConfirm });

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    data: { user },
  });
});

module.exports = { signup };
