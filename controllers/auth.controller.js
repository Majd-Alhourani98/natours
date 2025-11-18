const User = require('../models/user.model');
const sendSuccess = require('../utils/responseHandler');
const HTTP_STATUS = require('./../constants/httpStatus');
const catchAsync = require('./../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    data: { user },
  });
});

module.exports = {
  signup,
};
