const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const sendResponse = require('../utils/sendResponse');

const signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm, verifyMethod = 'otp' } = req.body;
  const user = new User({ email, name, password, passwordConfirm, isEmailVerified: false });

  const credentials = user.setupVerification(verifyMethod);

  await user.save();

  try {
    const message = await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      text:
        verifyMethod === 'link'
          ? `Link: ${process.env.FRONTEND_URL}/verify?token=${credentials.token}&email=${user.email}`
          : `OTP: ${credentials.otp}`,
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
    data: { user, otp: credentials.otp, token: credentials.token },
  });
});

module.exports = { signup };
