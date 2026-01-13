const notFound = (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  next(err);
};

module.exports = notFound;
