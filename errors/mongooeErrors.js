const { BadRequestError, ConflictError, ValidationError } = require('./AppError');

const handleCastErrorDB = err => {
  return new BadRequestError(`Invalid ${err.path}: ${err.value}.`);
};

const handleDuplicateFieldsDB = err => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  return new ConflictError(`Duplicate field: ${field}: "${value}". Please use another value.`);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(error => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ValidationError(message);
};

module.exports = { handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB };
