const { AppError } = require('./appError');

const errorFactory = (statusCode, code, defaultMessage) => {
  return class extends AppError {
    constructor(message = defaultMessage) {
      super(message, statusCode, code);
    }
  };
};

module.exports = errorFactory;
