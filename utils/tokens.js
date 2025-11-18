const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const env = require('./../config/env.config');

const generateToken = id => {
  const payload = {
    id: id,
    hash: crypto.randomBytes(8).toString('hex'),
  };

  return jwt.sign(payload, env.JWT.SECRET, {
    expiresIn: env.JWT.EXPIRES_IN,
  });
};

module.exports = generateToken;
