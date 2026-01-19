const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const sendResponse = require('../utils/sendResponse');

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm, verifyMethod = 'otp' } = req.body;

  const user = new User({
    email,
    name,
    password,
    passwordConfirm,
    isEmailVerified: false,
  });

  let token, otp;

  if (verifyMethod === 'otp') {
    otp = user.generateEmailVerificationOtp();
  } else if (verifyMethod == 'link') {
    token = user.generateEmailVerificationToken();
  }

  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text:
        verifyMethod == 'link'
          ? `Click this link to verify your email: ${process.env.FRONTEND_URL}/api/v1/auth/verify-email?token=${token}&email=${user.email}`
          : `Your OTP for email verification is: ${otp}`,
      // html,
    });
  } catch (error) {
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpires = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
  }

  const message =
    verifyMethod === 'otp'
      ? 'Registration successful! Please check your email for the verification OTP.'
      : 'Registration successful! A verification link has been sent to your email.';

  sendResponse(res, {
    statusCode: 201,
    message,
    data: { user, otp, token },
  });
});

module.exports = { signup };
