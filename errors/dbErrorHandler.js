const AppError = require("../errors/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  const message = `Duplicate field: ${field}: "${value}". Please use another value.`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // 1) Extract all error messages from the object values
  const errors = Object.values(err.errors).map((el) => el.message);

  // 2) Join them into a single readable string
  const message = `Invalid input data: ${errors.join(". ")}`;

  return new AppError(message, 400);
  //   return new AppError(err.message, 400);
};

module.exports = {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
};
