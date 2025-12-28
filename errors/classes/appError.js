const httpStatus = require('../../constants/httpStatus');
const responseStatus = require('../../constants/responseStatus');
const errorTypes = require('../../constants/errorTypes');

class AppError extends Error {
  constructor(
    message,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    code = errorTypes.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? responseStatus.FAIL : responseStatus.ERROR;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  AppError,
};
