const crypto = require('crypto');

const generateOtp = (length = 6, expiryDurationsMs = 15 * 60 * 1000) => {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10);
  }

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const otpExpires = new Date(Date.now() + expiryDurationsMs);

  return { otp, hashedOtp, otpExpires };
};

console.log(generateOtp());
