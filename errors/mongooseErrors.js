const { BadRequestError, ConflictError, ValidationError } = require('./appError');

const handleCastErrorDB = (err) => {
  return new BadRequestError(`Invalid ${err.path}: ${err.value}.`);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ConflictError(message);
};

const handleValidationErrorDB = (err) => {
  // Object.values converts the 'errors' object into an array we can loop through
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;
  return new ValidationError(message);
};

module.exports = { handleCastErrorDB, handleDuplicateFieldsDB, handleValidationErrorDB };
