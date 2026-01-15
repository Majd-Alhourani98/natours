const AppError = require("../errors/AppError");
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

const findTourById = async (id) => {
  const tour = await Tour.findById(id);

  if (!tour) throw new AppError(`No tour found with that ID ${id}`, 404);

  return tour;
};

const updateTourById = async (id, data) => {
  const tour = await Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!tour) throw new AppError(`No tour found with that ID ${id}`, 404);

  return tour;
};

const deleteTourById = async (id) => {
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) throw new AppError(`No tour found with that ID ${id}`, 404);

  return null;
};

module.exports = {
  findAllTours,
  createNewTour,
  findTourById,
  updateTourById,
  deleteTourById,
};
