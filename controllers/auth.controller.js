const jwt = require('jsonwebtoken');

const { promisify } = require('util');
const catchAsync = require('../errors/catchAsync');
const User = require('../models/user.model');
const { sendEmail } = require('../utils/email');
const { ConflictError, BadRequestError, AuthenticationError } = require('../errors/AppError.js');
const { hashValue } = require('../utils/crypto');
const { getCurrentTime } = require('../utils/date.js');

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // 1. Standard existence check
  const existingUser = await User.findOne({ email }).select('_id').lean();
  if (existingUser) return next(new ConflictError('Email already in use'));

  const user = new User(req.body);

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
    emailVerificationOTPExpiresAt: { $gte: getCurrentTime() },
  });

  // 2. If no user found, the OTP is either wrong or expired
  if (!user) return next(new BadRequestError('OTP invalid or expires'));

  // 3. Mark as verified and cleanup security fields
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpiresAt = undefined;

  await user.save({ validateBeforeSave: false });

  const token = user.generateAuthToken();
  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully!',
    token,
    data: user,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Please provide email and password'));
  }

  // 1. Check if user exists
  const user = await User.findOne({ email }).select('+password +isEmailVerified');
  if (!user) return next(new AuthenticationError('Incorrect email or password'));

  // 2. Check if email is verified
  if (!user.isEmailVerified) {
    return next(new AuthenticationError('Please verify your email before logging in'));
  }

  // 3. Compare password
  if (!(await user.comparePassword(password))) return next(new AuthenticationError('Incorrect email or password'));

  const token = user.generateAuthToken();

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully!',
    requestedAt: new Date().toISOString(),
    token: token,
    data: { user },
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AuthenticationError('You are not logged in! please log in to get access.'));
  }

  // token verification
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if the user still exists
  const user = await User.findById(decode.id);
  if (!user) return next(new AuthenticationError('the User belonging to this token does no longet exsit.'));

  if (user.passwordChangedAt && decode.iat < parseInt(user.passwordChangedAt.getTime() / 1000, 10)) {
    return next(new AuthenticationError('User recently changed password! Pleaase log in again'));
  }

  next();
});

module.exports = { signup, verifyEmail, login, protect };

// Header Key: Authorization
// Header Value: Bearer <your_jwt_token>
// Express automatically turn all Headers keys into small letters

// jwt.verify(sync): Simple but blocks the event loop, stopping your server from handling other requests during the cryptographic check.

// promisify(jwt.verify): Converts the function to a Promise, allowing the use of await without blocking the server's performance.
