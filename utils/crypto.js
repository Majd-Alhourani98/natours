const crypto = require('crypto');

const genereateToken = (length = 32, expiryDurationsMs = 10 * 60 * 1000) => {
  const token = crypto.randomBytes(length).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const expiryToken = Date.now() + expiryDurationsMs;

  return { token, hashedToken, expiryToken };
};

const generateOtp = (length = 6, expiryDurationsMs = 10 * 60 * 1000) => {
  // let otp = '';
  // for (let i = 0; i < length; i++) {
  //   otp += crypto.randomInt(0, 10);
  // }

  // Generates a random number (e.g., 0 to 999999) and pads with leading zeros
  const max = Math.pow(10, length);
  const otp = crypto.randomInt(0, max).toString().padStart(length, '0');

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const expiryOtp = Date.now() + expiryDurationsMs;

  return { otp, hashedOtp, expiryOtp };
};

console.log(genereateToken());
console.log(generateOtp());

module.exports = { generateOtp, genereateToken };

//   const minutesRemaining = Math.round((expiryToken - Date.now()) / (1000 * 60));
//   console.log(`Minutes until expiry: ${minutesRemaining}`);
