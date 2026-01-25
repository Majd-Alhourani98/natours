const crypto = require('crypto');

const generateSecureOTP = () => {
  let otp = '';

  for (let i = 0; i < 6; i++) {
    otp += crypto.randomInt(0, 10);
  }

  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
  return { otp, hashedOTP };
};

console.log(generateSecureOTP());
