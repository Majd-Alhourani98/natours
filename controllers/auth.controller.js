const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { sendEmail } = require('../utils/email');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = new User({ name, email, password, passwordConfirm });

  const otp = user.generateEmailVerificationOTP();
  await user.save();

  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    text: `Your OTP for email verification is: ${otp} `,
  });

  res.status(201).json({
    status: 'success',
    message: 'User created successfully. Welcome aboard!',
    requestedAt: new Date().toISOString(),
    data: { user },
    otp,
  });
});

module.exports = { signup };
