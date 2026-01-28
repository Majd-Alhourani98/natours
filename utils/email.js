const transporter = require('../config/transporter');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const sendEmailWithRetry = async (options, retries = 3, dealy = 2000) => {
  for (let attempts = 1; attempts <= retries; attempts++) {
    try {
      await sendEmail(options);
      console.log('email send successfully');
      return;
    } catch (error) {
      console.error(`Attempt ${attempts} failed`, error.message);

      if (attempts === retries) throw error;

      await sleep(dealy * attempts);
    }
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    // html
  });
};

const sendVerificationEmail = async ({ to, verifyMethod, credentials }) => {
  const text =
    verifyMethod === 'link'
      ? `Click this link to verify your email: ${process.env.FRONTEND_URL}/api/v1/verify-email?token=${credentials.token}&email=${to}`
      : `Your OTP for email verification is: ${credentials.otp}`;

  await sendEmailWithRetry({ to, subject: 'Verify your email', text });
};

module.exports = { sendVerificationEmail };
