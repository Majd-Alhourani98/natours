const dotenv = require('dotenv').config();

const crypto = require('crypto');
const { getExpiryDate } = require('./date');

const OTP = {
  LENGTH: Number(process.env.OTP_LENGTH) || 6,
  TTL_MS: Number(process.env.OTP_TTL_MS) || 15 * 60 * 1000,
};

const TOKEN = {
  LENGTH: Number(process.env.TOKEN_LENGTH) || 32,
  TTL_MS: Number(process.env.TOKEN_TTL_MS) || 15 * 60 * 1000,
};

console.log(process.env.TOKEN_LENGTH, process.env.TOKEN_TTL_MS);

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

const generateSecureToken = (length = TOKEN.LENGTH, ttlMs = TOKEN.TTL_MS) => {
  const token = crypto.randomBytes(length).toString('hex');
  const hashedToken = hashValue(token);
  const tokenExpires = getExpiryDate(ttlMs);

  return { token, hashedToken, tokenExpires };
};

module.exports = { generateSecureOTP, hashValue, generateSecureToken };
