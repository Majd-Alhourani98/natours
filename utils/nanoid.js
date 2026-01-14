const { customAlphabet } = require('nanoid');

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 9);

const generateNanoId = () => {
  return nanoid();
};

module.exports = generateNanoId;
