const { handlehandleJWTError, handleTokenExpiredError } = require('./JWTErrors');
const { handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB } = require('./mongooeErrors');

const transformError = err => {
  let error = { ...err };
  error.name = err.name;
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handlehandleJWTError();
  if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

  return error;
};

module.exports = transformError;
