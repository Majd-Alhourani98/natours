const { nanoid, customAlphabet } = require('nanoid');

const nanoidLetters = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 9);

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  // 1. Generate unique error code
  const errorCode = nanoidLetters();

  // 2. Log error to console (for server logs/monitoring)
  console.error('💥 CRITICAL ERROR 💥');
  console.error('Error Code:', errorCode);
  console.error('Timestamp:', new Date().toISOString());
  console.error('Request:', req.method, req.originalUrl);
  console.error('IP:', req.ip);
  console.error('Error:', err);
  console.error('Stack:', err.stack);

  // 3. Send generic message to client
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong on our end. Please try again later.',
    errorCode: errorCode, // Client can share this with support
  });
};
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    return sendErrorProd(err, req, res);
  }
};

module.exports = errorHandler;
