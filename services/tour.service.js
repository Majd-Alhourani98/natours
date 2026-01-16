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

const getTourStats = async () => {
  const stats = await Tour.aggregate([
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              numTours: { $sum: 1 },
              numOfRatings: { $sum: "$ratingsQuantity" },
              avgRating: { $avg: "$ratingsAverage" },
              minRating: { $min: "$ratingsAverage" },
              maxRating: { $max: "$ratingsAverage" },
              avgPrice: { $avg: "$price" },
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
            },
          },

          {
            $project: { _id: 0 },
          },
        ],

        byDifficulty: [
          {
            // 1) Filter for tours with a high enough rating
            $match: { ratingsAverage: { $gte: 4.5 } },
          },
          {
            // 2) Group by difficulty (converted to uppercase)
            $group: {
              _id: { $toUpper: "$difficulty" },
              numTours: { $sum: 1 },
              numOfRatings: { $sum: "$ratingsQuantity" },
              avgRating: { $avg: "$ratingsAverage" },
              minRating: { $min: "$ratingsAverage" },
              maxRating: { $max: "$ratingsAverage" },
              avgPrice: { $avg: "$price" },
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
            },
          },
          {
            // 3) Sort by average price (ascending)
            $sort: { avgPrice: 1 },
          },
          {
            // 4) Filter out 'EASY' (Note: must be uppercase to match group stage)
            $match: { _id: { $ne: "EASY" } },
          },
        ],
      },
    },
  ]);

  return stats[0];
};

exports.getMonthlyPlan = async (year) => {
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: { name: "$name", price: "$price" } },
      },
    },
    {
      $addFields: {
        month: "$_id",
        monthName: {
          $let: {
            vars: {
              monthsInString: [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            },
            in: { $arrayElemAt: ["$$monthsInString", "$_id"] },
          },
        },
      },
    },
    { $project: { _id: 0 } },
    { $sort: { month: 1 } },
  ]);

  return plan;
};

// field: the name of the field
// $field: the data inside that field
// $$var: A temporary value you created.

module.exports = {
  findAllTours,
  createNewTour,
  findTourById,
  updateTourById,
  deleteTourById,
  getTourStats,
};
