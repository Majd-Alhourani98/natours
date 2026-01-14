const { customAlphabet } = require('nanoid');

const nanoidLetters = customAlphabet('abcdefghijklmnopqrstuvwxyz123456789', 5);

console.log(nanoidLetters());
module.exports = nanoidLetters;
