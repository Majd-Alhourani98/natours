const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  // Optional: prevent long-running hanging connections
  // connectionTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.error('💥 Transporter error:', err.message);
  } else {
    console.log('🚀 Email Transporter is ready to send messages');
  }
});

module.exports = nodemailer;
