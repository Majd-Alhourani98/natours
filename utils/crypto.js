const crypto = require('crypto');

const OTP = {
  LENGTH: Number(process.env.OTP_LENGTH) || 6,
  TTL_MS: Number(process.env.OTP_TTL_MS) || 15 * 60 * 1000,
};

const hashValue = value => {
  return crypto.createHash('sha256').update(value).digest('hex');
};

const getExpiryDate = ttlMs => {
  return new Date(Date.now() + ttlMs);
};

const generateSecureOTP = (length = OTP.LENGTH, ttlMs = OTP.TTL_MS) => {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }

  const hashedOTP = hashValue(otp);
  const otpExpires = getExpiryDate(ttlMs);

  return { otp, hashedOTP, otpExpires };
};

console.log(generateSecureOTP());
