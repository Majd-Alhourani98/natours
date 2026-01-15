const APIFeatures = require("../utils/apiFeatures");
const Tour = require("./../models/tour.model");

const findAllTours = async (queryString) => {
  // Build the query
  const features = new APIFeatures(Tour.find(), queryString)
    .filter()
    .search()
    .sort()
    .select()
    .paginate();

  const { page = 1, limit = 12 } = features.paginationData;

  const [tours, paginationMetaData] = await Promise.all([
    features.query,
    Tour.getPaginationMetaData(features.mongoFilter, page, limit),
  ]);

  return { tours, paginationMetaData };
};

const createNewTour = async (data) => {
  const tour = await Tour.create(data);

  return tour;
};

module.exports = {
  findAllTours,
  createNewTour,
};
