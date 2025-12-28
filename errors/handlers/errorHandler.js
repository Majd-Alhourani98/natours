const { AppError, BadRequestError, ConflictError, ValidationError } = require('../classes/appError');
const httpStatus = require('../../constants/httpStatus');


const handleCastErrorDB = (err) => {
  return new BadRequestError(`Invalid ${err.path}: ${err.value}.`);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new ConflictError(`Duplicate field: ${field}: "${value}". Please use another value.`);
};

const handleValidationErrorDB = (err) => {
  const messages = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

  return new ValidationError(err.message || messages);
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong, Please try again later',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.code = err.code;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(err);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
