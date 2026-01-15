const crypto = require('crypto');
const { getExpiryDate } = require('./date');

const hashValue = value => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

const generateOtp = (length = 6, expiryDurationsMs = 15 * 60 * 1000) => {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }

  const hashedOtp = hashValue(otp);
  const otpExpires = getExpiryDate(expiryDurationsMs);

  return { otp, hashedOtp, otpExpires };
};

console.log(generateOtp());
