// =======================
// IMPORTS
// =======================
const AppError = require('../utils/appError');
const Tour = require('./../models/tour.model');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

// =======================
// CONTROLLERS
// =======================

const aliasTopTours = (req, res, next) => {
  // Set query parameters
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

// GET /api/v1/tours
// Fetch all tours and send them in the response
const getAllTours = catchAsync(async (req, res, next) => {
  // Build query using APIFeatures class with method chaining
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

  // Execute the query
  const tours = await features.query;

  // Get pagination metadata
  const pagination = await features.getPaginationMetadata(Tour);

  // Send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    pagination,
    data: {
      tours,
    },
  });
});

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`No tour found with this ID: ${id}`, 404));
  }
  // Tour.findOne({ _id: id });
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  // Tour.create({}).then().catch();
  const tour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour },
  });
});

// PATCH /api/v1/tours/:id
// Update a tour (currently placeholder)
const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const tour = await Tour.findByIdAndUpdate(id, body, {
    new: true, // return the new documnet
    runValidators: true, // run validator
  });

  if (!tour) {
    return next(new AppError(`No tour found with this ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// DELETE /api/v1/tours/:id
// Delete a tour by ID
const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return next(new AppError(`No tour found with this ID: ${id}`, 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $facet: {
        // Overall stats for all tours
        overall: [
          {
            $group: {
              _id: null,
              avgRating: { $avg: '$ratingsAverage' },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
              numRating: { $sum: '$ratingsQuantity' },
              numTours: { $sum: 1 },
            },
          },
          { $project: { _id: 0 } }, // clean output
        ],

        // Stats grouped by difficulty
        byDifficulty: [
          {
            $group: {
              _id: { $toUpper: '$difficulty' },
              avgRating: { $avg: '$ratingsAverage' },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
              numRating: { $sum: '$ratingsQuantity' },
              numTours: { $sum: 1 },
            },
          },

          { $sort: { _id: 1 } }, // optional: sort by difficulty name
        ],
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats: stats[0] }, // $facet returns an array with one object
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },

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
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: {
        month: '$_id',
      },
    },

    {
      $project: { _id: 0 },
    },

    {
      $sort: { numTourStarts: -1 },
    },

    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

// Export all controller functions for use in routes
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
