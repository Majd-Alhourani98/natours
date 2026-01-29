const getExpiryDate = ttlMs => {
  return new Date(Date.now() + ttlMs);
};

const getCurrentTime = () => {
  return new Date(Date.now());
};

module.exports = { getExpiryDate, getCurrentTime };
