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
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrorHandler = (err, req, res, next) => {
  // Set default values for error status and code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log error details based on environment
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    return sendErrorProd(err, res);
  }
  // Send error response
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorHandler;
