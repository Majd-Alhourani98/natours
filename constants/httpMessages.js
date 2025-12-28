const httpMessages = {
  // Success messages
  OK: 'Request successful',
  CREATED: 'Resource created successfully',
  ACCEPTED: 'Request accepted',
  NO_CONTENT: 'No content',

  // Client errors
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Authentication failed',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  REQUEST_TIMEOUT: 'Request timeout',
  CONFLICT: 'Conflict',
  PAYLOAD_TOO_LARGE: 'Payload too large',
  UNPROCESSABLE_ENTITY: 'Validation failed',
  TOO_MANY_REQUESTS: 'Too many requests',

  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',
};

module.exports = httpMessages;
