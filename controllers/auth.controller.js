const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { sendEmail } = require('../utils/email');
const { ConflictError } = require('../errors/AppError.js');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // 1. Standard existence check
  const existingUser = await User.findOne({ email }).select('_id').lean();
  if (existingUser) return next(new ConflictError('Email already in use'));

  const user = new User({ name, email, password, passwordConfirm, isEmailVerified: false });

  const otp = user.generateEmailVerificationOTP();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text: `Your OTP for email verification is: ${otp} `,
    });
  } catch (error) {
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiresAt = undefined;
  } finally {
    await user.save();
  }

  res.status(201).json({
    status: 'success',
    message: 'User created successfully!. Please check your email for the verification code.',
    requestedAt: new Date().toISOString(),
    data: { user },
  });
});

module.exports = { signup };
