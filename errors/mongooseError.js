const AppError = require('./AppError');

const handleCastErrorDB = err => {
  const path = err.path || 'field';
  const value = err.value ?? 'unknown';

  return new AppError(`Invalid ${path}: ${value}`, 400);
};

module.exports = { handleCastErrorDB };
