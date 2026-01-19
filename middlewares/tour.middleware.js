// Middleware to alias top five tours
// Sets query parameters for top five tours
const aliasTopFiveTour = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

module.exports = { aliasTopFiveTour };
