class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    // Call the parent constructor
    super(message);

    // Set additional properties
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    // Capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
