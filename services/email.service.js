const transporter = require('../config/transporter');
const sleep = require('../utils/sleep');

const isRetryable = (error) => error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION' || error.responseCode >= 500;

const sendEmailWithRetry = async (options, retries = 3, delay = 2000) => {
  for (let attempts = 1; attempts <= 3; attempts++) {
    try {
      await sendEmail(options);
      return;
    } catch (error) {
      console.error(`Attempt ${attempts} failed`, error.message);

      if (!isRetryable(error) || attempts === retries) {
        throw error; // preserve original error
      }

      await sleep(delay * attempts);
    }
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_from,
    to,
    subject,
    text,
    // html,
  });
};

const sendVerificationEmail = async ({ email, verifyMethod, token, otp }) => {
  await sendEmailWithRetry({
    to: email,
    subject: 'Verify your email',
    text:
      verifyMethod === 'otp'
        ? `Your OTP from email verification is: ${otp}`
        : `Click this link to verify your email: ${process.env.FRONTEND_URL}api/v1/auth/verify-email?token=${token}&email=${email}`,
  });
};

module.exports = { sendVerificationEmail };
