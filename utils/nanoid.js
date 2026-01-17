const { customAlphabet } = require("nanoid");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

/**
 * Generates a random alphabetical string.
 * @param {number} length - The length of the string (default is 5).
 */
const generateUsernameSuffix = (length = 5) => {
  const nanoid = customAlphabet(alphabet, length);
  return nanoid();
};

module.exports = { generateUsernameSuffix };
