const AppError = require("../errors/AppError");
const Tour = require("../models/tour.model");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

// GET /tours - Get all tours
// Supports filtering, searching, sorting, field limiting, and pagination
const getAllTours = catchAsync(async (req, res, next) => {
  // Build the query
  const features = new APIFeatures(Tour.find(), req.query)
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

  return res.status(200).json({
    status: "success",
    results: tours.length,
    message: "Tours retrieved successfully",
    paginationMetaData,
    data: {
      tours: tours,
    },
  });
});

// POST /tours - Create a new tour
// Expects tour data in request body
const createTour = catchAsync(async (req, res, next) => {
  const data = req.body;
  const tour = await Tour.create(data);

  return res.status(201).json({
    status: "success",
    message: "Tour created successfully",
    data: {
      tour: tour,
    },
  });
});

// GET /tours/:id - Get a specific tour by ID
// Expects tour ID in request parameters
const getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) return next(new AppError("No tour found with that ID", 404));

  return res.status(200).json({
    status: "success",
    message: "Tour retrieved successfully",
    data: { tour },
  });
});

// PATCH /tours/:id - Update a specific tour by ID
// Expects tour ID in request parameters and updated data in request body
const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const tour = await Tour.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError("No tour found with that ID", 404));

  return res.status(200).json({
    status: "success",
    message: "Tour updated successfully",
    data: { tour },
  });
});

// DELETE /tours/:id - Delete a specific tour by ID
// Expects tour ID in request parameters
const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) return next(new AppError("No tour found with that ID", 404));

  return res.status(204).send();
});

// Middleware to alias top five tours
// Sets query parameters for top five tours
const aliasTopFiveTour = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// GET /tours/stats - Get tour statistics
const getTourStats = catchAsync(async (req, res, next) => {
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

  return res.status(200).json({
    status: "success",
    message: "Statistics retrieved successfully",
    data: { stats: stats[0] },
  });
});

// GET /tours/monthly-plan/:year - Get monthly plan for a specific year
// Expects year in request parameters
const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

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
        // Pushing an object instead of just a string
        tours: { $push: { name: "$name", price: "$price" } },
      },
    },
    {
      $addFields: {
        month: "$_id",
        // Converting number to Name
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
            in: { $arrayElemAt: ["$monthsInString", "$_id"] },
          },
        },
      },
    },
    { $project: { _id: 0 } },
    { $sort: { month: 1 } }, // Sorting chronologically is usually better for plans
  ]);

  return res.status(200).json({
    status: "success",
    message: "Monthly plan retrieved successfully",
    results: plan.length,
    data: { plan },
  });
});

// field: the name of the field
// $field: the data inside that field
// $$var: A temporary value you created.

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopFiveTour,
  getTourStats,
  getMonthlyPlan,
};
