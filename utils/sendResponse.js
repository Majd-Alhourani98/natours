/**
 * Send standardized JSON response
 * @param {Object} res - Express response object
 * @param {Object} options - Response configuration
 */
const sendResponse = (
  res,
  {
    statusCode = 200,
    status = 'success',
    data = null,
    message = '',
    paginationMetaData = null,
    results = null,
    error = null,
    stack = null,
  },
) => {
  const json = { status, message };

  // Add data for success responses
  if (data !== null) {
    json.data = data;
  }

  // Add results count if provided
  if (results !== null) {
    json.results = results;
  }

  // Add pagination metadata if provided
  if (paginationMetaData) {
    json.paginationMetaData = paginationMetaData;
  }

  // Add error details for development
  if (error) {
    json.error = error;
  }

  if (stack) {
    json.stack = stack;
  }

  res.status(statusCode).json(json);
};

module.exports = sendResponse;
