const sanitizeUser = (user) => {
  const sanitized = { ...user._doc };

  delete sanitized.password;
  // for next lectures
  delete sanitized.emailVerificationToken;
  delete sanitized.emailVerificationTokenExpires;
  delete sanitized.passwordResetToken;
  delete sanitized.passwordResetExpires;
  delete sanitized.emailVerificationOTP;
  delete sanitized.emailVerificationOTPExpires;

  return sanitized;
};

module.exports = sanitizeUser;
