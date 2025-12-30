const getExpiryTimestamp = (durationMs) => {
  return Date.now() + durationMs;
};

module.exports = getExpiryTimestamp;
