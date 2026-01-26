const { customAlphabet } = require('nanoid');

const ALPHANUMERIC_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const DEFAULT_LENGTH = 6;

const generateErrorId = (length = DEFAULT_LENGTH) => {
  // customAlphabet returns a generator function, which we call immediately with ()
  return customAlphabet(ALPHANUMERIC_CHARSET, length)();
};

const generateUsernameSuffix = (length = DEFAULT_LENGTH) => {
  // customAlphabet returns a generator function, which we call immediately with ()
  return customAlphabet(ALPHANUMERIC_CHARSET, length)();
};

module.exports = { generateErrorId, generateUsernameSuffix };
