const { ConflictError, BadRequestError } = require('../errors/AppError');
const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { hashValue } = require('../utils/crypto');
const { currentTime } = require('../utils/date');
const { sendEmail } = require('../utils/email');

const AUTH = {
  SIGNUP_SUCCESS: 'Account created! Please check your email to verify your account.',
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new ConflictError('Email already is use'));

  const user = new User({ name, email, password, passwordConfirm });

  const otp = user.generateEmailVerificationOtp();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text: `Your OTP for email verification is: ${otp} `,
    });
  } catch (error) {
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;

    // We log it so developers know, but the user gets a 201 Success
    console.error('📧 Silent Email Failure:', error.message);
  } finally {
    await user.save();
  }

  res.status(201).json({
    status: 'success',
    message: AUTH.SIGNUP_SUCCESS,
    data: { user },
    otp,
  });
});

const verifyEmail = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new BadRequestError('Please provide both email and OTP.'));
  }

  const hashedOTP = hashValue(otp);

  // 1. Find user with matching email, valid hash, and non-expired time
  const user = await User.findOne({
    email: email,
    emailVerificationOTP: hashedOTP,
    emailVerificationOTPExpires: { $gte: currentTime() },
  });

  // 2. If no user found, the OTP is either wrong or expired
  if (!user) return next(new BadRequestError('OTP invalid or expires'));

  // 3. Mark as verified and cleanup security fields
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpires = undefined;

  // 4. Save without triggering password validation
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully!',
    data: user,
  });
});

module.exports = { signup, verifyEmail };
