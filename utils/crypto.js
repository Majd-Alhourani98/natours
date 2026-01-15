const crypto = require('crypto');
const { getExpiryDate } = require('./date');

const OTP = {
  LENGTH: Number(process.env.OTP_LENGTH) || 6,
  TTL_MS: Number(process.env.OTP_TTL_MS) || 15 * 60 * 1000,
};

const hashValue = value => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

const generateOtp = (length = OTP.LENGTH, expiryDurationsMs = OTP.TTL_MS) => {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }

  const hashedOtp = hashValue(otp);
  const otpExpires = getExpiryDate(expiryDurationsMs);

  return { otp, hashedOtp, otpExpires };
};

module.exports = { generateOtp };
