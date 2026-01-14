const { NotFoundError } = require('./appError');

const notFound = (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server`));
};

module.exports = notFound;
