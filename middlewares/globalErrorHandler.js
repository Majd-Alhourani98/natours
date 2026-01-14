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

const sendErrorDev = (err, res) => {
  // Development: send full error details
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  // Production: send limited error details for operational errors

  if (err.isOperational) {
    // Trusted error: send message to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log the error for internal tracking
    console.error("ERROR 💥", err);

    // Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!. Please try again later.",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  // Set default values for error status and code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error details based on environment
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    return sendErrorProd(error, res);
  }
  // Send error response
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorHandler;
