const httpStatus = require('../../constants/httpStatus');
const responseStatus = require('../../constants/responseStatus');
const errorTypes = require('../../constants/errorTypes');
const httpMessages = require('../../constants/httpMessages');

class AppError extends Error {
  constructor(
    message,
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    code = errorTypes.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? responseStatus.FAIL
      : responseStatus.ERROR;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = httpMessages.BAD_REQUEST) {
    super(message, httpStatus.BAD_REQUEST, errorTypes.BAD_REQUEST);
  }
}

class AuthenticationError extends AppError {
  constructor(message = httpMessages.UNAUTHORIZED) {
    super(message, httpStatus.UNAUTHORIZED, errorTypes.AUTHENTICATION_FAILED);
  }
}

class ForbiddenError extends AppError {
  constructor(message = httpMessages.FORBIDDEN) {
    super(message, httpStatus.FORBIDDEN, errorTypes.FORBIDDEN);
  }
}

class NotFoundError extends AppError {
  constructor(message = httpMessages.NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND, errorTypes.NOT_FOUND);
  }
}

class ConflictError extends AppError {
  constructor(message = httpMessages.CONFLICT) {
    super(message, httpStatus.CONFLICT, errorTypes.CONFLICT);
  }
}

class ValidationError extends AppError {
  constructor(message = httpMessages.UNPROCESSABLE_ENTITY) {
    super(message, httpStatus.UNPROCESSABLE_ENTITY, errorTypes.VALIDATION_ERROR);
  }
}

class TooManyRequestsError extends AppError {
  constructor(message = httpMessages.TOO_MANY_REQUESTS) {
    super(message, httpStatus.TOO_MANY_REQUESTS, errorTypes.TOO_MANY_REQUESTS);
  }
}

class PayloadTooLargeError extends AppError {
  constructor(message = httpMessages.PAYLOAD_TOO_LARGE) {
    super(message, httpStatus.PAYLOAD_TOO_LARGE, errorTypes.PAYLOAD_TOO_LARGE);
  }
}

class RequestTimeoutError extends AppError {
  constructor(message = httpMessages.REQUEST_TIMEOUT) {
    super(message, httpStatus.REQUEST_TIMEOUT, errorTypes.REQUEST_TIMEOUT);
  }
}

// 5xx Server Errors
class InternalServerError extends AppError {
  constructor(message = httpMessages.INTERNAL_SERVER_ERROR) {
    super(
      message,
      httpStatus.INTERNAL_SERVER_ERROR,
      errorTypes.INTERNAL_SERVER_ERROR,
      false // Internal errors might not be operational, but usually we treat handled ones as such? 
      // Actually, AppError defaults isOperational to true. 
      // InternalServerError usually implies something went wrong that wasn't user input. 
      // However, if we are throwing it explicitly, it IS 'operational' in the sense that we caught it. 
      // But standard practice for 500 is often isOperational=false if it's an unhandled exception.
      // Since this class is used to explicitly throw a 500, let's keep it true (default) or make it explicit.
      // Let's stick to true for explicitly thrown errors.
    );
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = httpMessages.SERVICE_UNAVAILABLE) {
    super(
      message,
      httpStatus.SERVICE_UNAVAILABLE,
      errorTypes.SERVICE_UNAVAILABLE
    );
  }
}

module.exports = {
  AppError,
  BadRequestError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  PayloadTooLargeError,
  RequestTimeoutError,
  InternalServerError,
  ServiceUnavailableError,
};
