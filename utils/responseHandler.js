const env = require('./../config/env.config');
// JWT life in days

// Default cookie options
const COOKIE_OPTIONS = {
  httpOnly: true, // Not accessible via JS
  secure: env.FLAGS.isProduction, // Only send over HTTPS in production
  sameSite: 'Strict', // CSRF protection
  maxAge: env.JWT.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  // expires: new Date(Date.now() + JWT_LIFETIME_DAYS * 24 * 60 * 60 * 1000), // Alternative using absolute expiration date
};

const sendSuccess = (
  res,
  {
    statusCode = 200,
    message = 'Success',
    data = null,
    meta = null,
    results = null,
    token = null,
  } = {}
) => {
  const response = { status: 'success', message };

  if (results !== null) response.results = results;
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;

  // Send token in secure HTTP-only cookie
  if (token) {
    res.cookie('jwt', token, COOKIE_OPTIONS);
  }

  return res.status(statusCode).json(response);
};

module.exports = sendSuccess;
