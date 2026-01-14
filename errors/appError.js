const httpStatus = require('../constants/httpStatus');

class AppError extends Error {
  constructor(
    message,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    code = null,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request - general client input error
class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, httpStatus.BAD_REQUEST, 'BAD_REQUEST');
  }
}

// 401 Authentication failed - invalid or missing credentials
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, httpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
  }
}

// 403 Forbidden - user lacks permission to access resource
class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, httpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

// 404 Not Found - requested resource does not exist
class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, httpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}

// 409 Conflict - request conflicts with current state of resource
class ConflictError extends AppError {
  constructor(message = 'Conflict: Resource already exists') {
    super(message, httpStatus.CONFLICT, 'CONFLICT');
  }
}

// 422 Unprocessable Entity - data validation failed
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, httpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR');
  }
}

// 429 Too Many Requests - rate limiting exceeded
class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, httpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  }
}

// 413 Payload Too Large - request body exceeds allowed size
class PayloadTooLargeError extends AppError {
  constructor(message = 'Payload too large') {
    super(message, httpStatus.PAYLOAD_TOO_LARGE, 'PAYLOAD_TOO_LARGE');
  }
}

// 5xx Server Errors:

// 500 Internal Server Error - generic server-side failure
class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
  }
}

// 503 Service Unavailable - server temporarily unable to handle request
class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(message, httpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE');
  }
}

module.exports = {
  BadRequestError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  PayloadTooLargeError,
  InternalServerError,
  ServiceUnavailableError,
};
