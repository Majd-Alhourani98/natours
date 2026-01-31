const jwt = require('jsonwebtoken');

const JWT = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};

const signToken = payload => {
  return jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
};

module.exports = { signToken };
