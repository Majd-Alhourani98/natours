module.exports = {
  // Success messages
  OK: 'Request successful',
  CREATED: 'Resource created successfully',
  ACCEPTED: 'Request accepted and processing',
  NO_CONTENT: 'No content to return',

  // Client errors (4xx)
  BAD_REQUEST: 'Invalid request data',
  UNAUTHORIZED: 'Authentication required or failed',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'Requested resource was not found',
  METHOD_NOT_ALLOWED: 'HTTP method not allowed for this endpoint',
  REQUEST_TIMEOUT: 'Request timed out',
  CONFLICT: 'Resource conflict detected',
  PAYLOAD_TOO_LARGE: 'Request payload exceeds allowed size',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported content type',
  UNPROCESSABLE_ENTITY: 'Validation failed for one or more fields',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',

  // Auth / security specific
  INVALID_TOKEN: 'Invalid authentication token',
  TOKEN_EXPIRED: 'Authentication token has expired',
  INVALID_CREDENTIALS: 'Invalid email or password',

  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
  NOT_IMPLEMENTED: 'This functionality is not implemented',
  BAD_GATEWAY: 'Invalid response from upstream server',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  GATEWAY_TIMEOUT: 'Upstream server did not respond in time',
};
