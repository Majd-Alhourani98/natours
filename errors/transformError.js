const { handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB } = require('./mongooeErrors');

const transformError = err => {
  let error = { ...err };
  error.name = err.name;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  return error;
};

module.exports = transformError;
