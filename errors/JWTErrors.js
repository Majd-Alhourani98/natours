const { AuthenticationError } = require('./AppError');

const handlehandleJWTError = () => {
  return new AuthenticationError('Invlid token, Please log in again!');
};

const handleTokenExpiredError = err => {
  return new AuthenticationError('Your token has expired! please log in again.');
};

module.exports = { handlehandleJWTError, handleTokenExpiredError };
