const sanitizeUser = user => {
  const sanitized = { ...user._doc };

  delete sanitized.password;

  return sanitized;
};

module.exports = sanitizeUser;
