const httpStatus = require('../constants/httpStatus');
const httpMessage = require('../constants/httpMessages');
const responseStatus = require('../constants/responseStatus');

class AppError extends Error {
  constructor(
    message,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    code = null,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? responseStatus.FAIL : responseStatus.ERROR;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request - general client input error
class BadRequestError extends AppError {
  constructor(message = httpMessage.BAD_REQUEST) {
    super(message, httpStatus.BAD_REQUEST, 'BAD_REQUEST');
  }
}

// 401 Authentication failed - invalid or missing credentials
class AuthenticationError extends AppError {
  constructor(message = httpMessage.UNAUTHORIZED) {
    super(message, httpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
  }
}

// 403 Forbidden - user lacks permission to access resource
class ForbiddenError extends AppError {
  constructor(message = httpMessage.FORBIDDEN) {
    super(message, httpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}

// 404 Not Found - requested resource does not exist
class NotFoundError extends AppError {
  constructor(message = httpMessage.NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}

// 409 Conflict - request conflicts with current state of resource
class ConflictError extends AppError {
  constructor(message = httpMessage.CONFLICT) {
    super(message, httpStatus.CONFLICT, 'CONFLICT');
  }
}

// 422 Unprocessable Entity - data validation failed
class ValidationError extends AppError {
  constructor(message = httpMessage.UNPROCESSABLE_ENTITY) {
    super(message, httpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR');
  }
}

// 429 Too Many Requests - rate limiting exceeded
class TooManyRequestsError extends AppError {
  constructor(message = httpMessage.TOO_MANY_REQUESTS) {
    super(message, httpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS');
  }
}

// 413 Payload Too Large - request body exceeds allowed size
class PayloadTooLargeError extends AppError {
  constructor(message = httpMessage.PAYLOAD_TOO_LARGE) {
    super(message, httpStatus.PAYLOAD_TOO_LARGE, 'PAYLOAD_TOO_LARGE');
  }
}

// 5xx Server Errors:

// 500 Internal Server Error - generic server-side failure
class InternalServerError extends AppError {
  constructor(message = httpMessage.INTERNAL_SERVER_ERROR) {
    super(message, httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
  }
}

// 503 Service Unavailable - server temporarily unable to handle request
class ServiceUnavailableError extends AppError {
  constructor(message = httpMessage.SERVICE_UNAVAILABLE) {
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
