const transporter = require('../config/transporter');

const sendEmail = async options => {
  const mailOptions = {
    from: `${process.env.MAIL_FROM_NAME || 'Support'} <${process.env.MAIL_FROM_ADDRESS}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html: options.html, // Enabled HTML support
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    // Log the error but re-throw so the controller can handle it (e.g., via catchAsync)
    console.error('📧 Email sending failed:', error.message);
    throw new Error('There was an error sending the email. Try again later.');
  }
};

module.exports = { sendEmail };
