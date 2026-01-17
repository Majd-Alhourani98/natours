const { ConflictError } = require('../errors/AppError');
const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
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

module.exports = { signup };
