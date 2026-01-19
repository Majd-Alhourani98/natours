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

module.exports = sendEmail;
