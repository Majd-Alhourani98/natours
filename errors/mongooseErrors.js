const AppError = require('./appError');

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
};

module.exports = { handleCastErrorDB };
