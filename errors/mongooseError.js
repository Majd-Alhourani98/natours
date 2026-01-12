const { BadRequestError, ConflictError, ValidationError } = require('./AppError');

const handleCastErrorDB = err => {
  const path = err.path || 'field';
  const value = err.value ?? 'unknown';

  return new BadRequestError(`Invalid ${path}: ${value}`);
};

const handleDuplicateFieldsDB = err => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate field: ${field}: "${value}". Please use another value.`;
  return new ConflictError(message);
};

const handleValidationErrorDB = err => {
  // Extract all the error messages from the 'errors' object
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ValidationError(message);
  //   return new AppError(err.message, 400);
};

module.exports = { handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB };
