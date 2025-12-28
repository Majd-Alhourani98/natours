const httpStatus = require('../../constants/httpStatus');
const errorTypes = require('../../constants/errorTypes');
const httpMessages = require('../../constants/httpMessages');
const errorFactory = require('./errorFactory'); // your factory function

const BadRequestError = errorFactory(
  httpStatus.BAD_REQUEST,
  errorTypes.BAD_REQUEST,
  httpMessages.BAD_REQUEST
);

const AuthenticationError = errorFactory(
  httpStatus.UNAUTHORIZED,
  errorTypes.AUTHENTICATION_FAILED,
  httpMessages.UNAUTHORIZED
);

const ForbiddenError = errorFactory(
  httpStatus.FORBIDDEN,
  errorTypes.FORBIDDEN,
  httpMessages.FORBIDDEN
);

const NotFoundError = errorFactory(
  httpStatus.NOT_FOUND,
  errorTypes.NOT_FOUND,
  httpMessages.NOT_FOUND
);

const ConflictError = errorFactory(httpStatus.CONFLICT, errorTypes.CONFLICT, httpMessages.CONFLICT);

const ValidationError = errorFactory(
  httpStatus.UNPROCESSABLE_ENTITY,
  errorTypes.VALIDATION_ERROR,
  httpMessages.UNPROCESSABLE_ENTITY
);

const TooManyRequestsError = errorFactory(
  httpStatus.TOO_MANY_REQUESTS,
  errorTypes.TOO_MANY_REQUESTS,
  httpMessages.TOO_MANY_REQUESTS
);

const PayloadTooLargeError = errorFactory(
  httpStatus.PAYLOAD_TOO_LARGE,
  errorTypes.PAYLOAD_TOO_LARGE,
  httpMessages.PAYLOAD_TOO_LARGE
);

const RequestTimeoutError = errorFactory(
  httpStatus.REQUEST_TIMEOUT,
  errorTypes.REQUEST_TIMEOUT,
  httpMessages.REQUEST_TIMEOUT
);

const InternalServerError = errorFactory(
  httpStatus.INTERNAL_SERVER_ERROR,
  errorTypes.INTERNAL_SERVER_ERROR,
  httpMessages.INTERNAL_SERVER_ERROR
);

const ServiceUnavailableError = errorFactory(
  httpStatus.SERVICE_UNAVAILABLE,
  errorTypes.SERVICE_UNAVAILABLE,
  httpMessages.SERVICE_UNAVAILABLE
);

module.exports = {
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
