const nodemailer = require('nodemailer');
const env = require('./../config/env.config');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: env.EMAIL.HOST,
    port: env.EMAIL.PORT,
    auth: {
      user: env.EMAIL.USERNAME,
      pass: env.EMAIL.PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Majd Aldein Alhourani',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
