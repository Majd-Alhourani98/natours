const AppError = require('./AppError');

const handleCastErrorDB = err => {
  const path = err.path || 'field';
  const value = err.value ?? 'unknown';

  return new AppError(`Invalid ${path}: ${value}`, 400);
};

const handleDuplicateFieldsDB = err => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate field: ${field}: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

module.exports = { handleCastErrorDB, handleDuplicateFieldsDB };
