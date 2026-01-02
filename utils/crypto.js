const crypto = require('crypto');

const getExpiryTimestamp = require('./getExpiryTimestamp');

const generateToken = (length = 32, expiryDurationsMs = 10 * 60 * 1000) => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const tokenExpires = getExpiryTimestamp(expiryDurationsMs);

  return { token, hashedToken, tokenExpires };
};

const generateOTP = (length = 6, expiryDurationsMs = 10 * 60 * 1000) => {
  // let otp = '';

  // for (let i = 0; i < length; i++) {
  //   otp += crypto.randomInt(0, 10);
  // }

  const otp = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const otpExpires = getExpiryTimestamp(expiryDurationsMs);

  return { otp, hashedOtp, otpExpires };
};

module.exports = { generateToken, generateOTP };

// const now = Date.now();
// const diffInMs = now - otpExpires;
// const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
