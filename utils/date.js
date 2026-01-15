const currentTime = () => new Date(Date.now());

const getExpiryDate = ttlMs => {
  return new Date(Date.now() + ttlMs);
};

module.exports = { currentTime, getExpiryDate };
