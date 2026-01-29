const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { sendEmail } = require('../utils/email');
const { ConflictError } = require('../errors/AppError.js');
const { hashValue } = require('../utils/crypto');
const { getCurrentTime } = require('../utils/date.js');

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

const verifyEmail = catchAsync(async (req, res, next) => {
  const { otp, email } = req.body;

  if (!email || !otp) {
    return next(new BadRequestError('Please provide both email and OTP.'));
  }

  const hashedOTP = hashValue(otp);

  // 1. Find user with matching email, valid hash, and non-expired time
  const user = await User.findOne({
    email,
    emailVerificationOTP: hashedOTP,
    emailVerificationOTPExpiresAt: { $gte: currentTime() },
  });

  // 2. If no user found, the OTP is either wrong or expired
  if (!user) return next(new BadRequestError('OTP invalid or expires'));

  // 3. Mark as verified and cleanup security fields
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpiresAt = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully!',
    data: user,
  });
});

module.exports = { signup, verifyEmail };
