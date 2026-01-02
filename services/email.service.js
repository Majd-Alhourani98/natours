const transporter = require('../config/transporter');

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
  console.log(email, verifyMethod, otp, token);
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    text:
      verifyMethod === 'otp'
        ? `Your OTP from email verification is: ${otp}`
        : `Click this link to verify your email: ${process.env.FRONTEND_URL}api/v1/auth/verify-email?token=${token}&email=${email}`,
  });
};

module.exports = { sendVerificationEmail };
