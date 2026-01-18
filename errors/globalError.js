const { sendErrorProd, sendErrorDev } = require('./sendErrorResponse');
const transformError = require('./transformError');

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    const error = transformError(err);
    return sendErrorProd(error, req, res);
  }
};

module.exports = globalError;
