const crypto = require('crypto');
const { getExpiryDate } = require('./date');

const OTP = {
  LENGTH: Number(process.env.OTP_LENGTH) || 6,
  TTL_MS: Number(process.env.OTP_TTL_MS) || 15 * 60 * 1000,
};

const hashValue = value => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

const generateSecureOTP = (length = OTP.LENGTH, ttlMs = OTP.TTL_MS) => {
  // Maximum number for the given length (e.g., length=6 => 10^6)
  const max = Math.pow(10, length);
  let otp = String(crypto.randomInt(0, max)).padStart(6, '0');

  const hashedOTP = hashValue(otp);
  const otpExpires = getExpiryDate(ttlMs);

  return { otp, hashedOTP, otpExpires };
};

module.exports = { generateSecureOTP, hashValue };
