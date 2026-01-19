const crypto = require('crypto');

const generateToken = (length = 32, expiryDurationMs = 10 * 60 * 1000) => {
  const token = crypto.randomBytes(length).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const tokenExpires = Date.now() + expiryDurationMs;

  return { token, hashedToken, tokenExpires };
};

const generateOtp = (length = 6, expiryDurationMs = 10 * 60 * 1000) => {
  // Generates a random numeric string of specific length
  const otp = crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const otpExpires = Date.now() + expiryDurationMs;

  return { otp, hashedOtp, otpExpires };
};

module.exports = { generateToken, generateOtp };
