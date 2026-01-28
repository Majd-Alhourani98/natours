const transporter = require('../config/transporter');

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

  await sendEmail({ to, subject: 'Verify your email', text });
};

module.exports = { sendVerificationEmail };
