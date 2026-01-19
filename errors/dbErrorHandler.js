const { BadRequestError, ValidationError, ConflictError } = require('../errors/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  // Use BadRequestError for invalid ID formats/types
  return new BadRequestError(message);
};

const handleDuplicateFieldsDB = err => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate field: ${field}: "${value}". Please use another value.`;

  // Use ConflictError (409) as it best represents a duplicate resource state
  return new ConflictError(message);
};

const handleValidationErrorDB = err => {
  // 1) Extract all error messages from the object values
  const errors = Object.values(err.errors).map(el => el.message);

  // 2) Join them into a single readable string
  const message = `Invalid input data: ${errors.join('. ')}`;

  // Use your new ValidationError class (422)
  return new ValidationError(message);
};

module.exports = {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
};
