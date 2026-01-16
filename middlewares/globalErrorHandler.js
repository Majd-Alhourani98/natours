const sendResponse = require("../utils/sendResponse");
const {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
} = require("../errors/dbErrorHandler");

const transformError = (error) => {
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  return error;
};

const sendErrorDev = (err, res) => {
  // Development: send full error details
  sendResponse(res, {
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Production: send limited error details for operational errors
  if (err.isOperational) {
    // Trusted error: send message to client
    sendResponse(res, {
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
    });
  } else {
    // Log the error for internal tracking
    console.error("ERROR 💥", err);

    // Send generic message
    sendResponse(res, {
      statusCode: 500,
      status: "error",
      message: "Something went very wrong! Please try again later.",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  // Set default values for error status and code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    error = transformError(err);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
