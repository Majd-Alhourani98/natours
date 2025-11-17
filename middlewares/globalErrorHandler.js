const env = require('./../config/env.config');

const isDevelopment = env.FLAGS.isDevelopment;
const isProduction = env.FLAGS.isProduction;

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational Error, trusted error: Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error detailes
    // 1) log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err.message);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'err';

  if (isDevelopment) sendErrorDev(err, res);
  else if (isProduction) sendErrorProd(err, res);
};
