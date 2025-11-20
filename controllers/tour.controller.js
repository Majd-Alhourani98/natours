// =======================
// IMPORTS
// =======================
const AppError = require('../utils/appError');
const Tour = require('./../models/tour.model');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const sendSuccess = require('./../utils/responseHandler');
const HTTP_STATUS = require('./../constants/httpStatus');

// =======================
// CONTROLLERS
// =======================

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
  const tours = await features.query;
  const pagination = await features.getPaginationMetadata(Tour);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Tours retrieved successfully',
    meta: pagination,
    data: { tours },
    results: tours.length,
  });
});

const getSingleTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) return next(new AppError(`No tour found with this ID: ${id}`, HTTP_STATUS.NOT_FOUND));

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Tour retrieved successfully',
    data: { tour },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.CREATED,
    message: 'Tour created successfully',
    data: { tour },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const tour = await Tour.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!tour) return next(new AppError(`No tour found with this ID: ${id}`, HTTP_STATUS.NOT_FOUND));

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Tour updated successfully',
    data: { tour },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) return next(new AppError(`No tour found with this ID: ${id}`, HTTP_STATUS.NOT_FOUND));

  sendSuccess(res, {
    statusCode: HTTP_STATUS.NO_CONTENT,
    message: 'Tour deleted successfully',
    data: null,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $facet: {
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
          { $project: { _id: 0 } },
        ],
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
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: 'Tour statistics retrieved successfully',
    data: { stats: stats[0] },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
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
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);

  sendSuccess(res, {
    statusCode: HTTP_STATUS.OK,
    message: `Monthly plan for ${year} retrieved successfully`,
    data: { plan },
  });
});

// =======================
// EXPORT CONTROLLERS
// =======================
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
