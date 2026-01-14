const { NotFoundError } = require('../errors/appError');
const httpStatus = require('../constants/httpStatus');

const catchAsync = require('../errors/catchAsync');
const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');
const responseStatus = require('../constants/responseStatus');

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .search()
    .applyFilter()
    .sort()
    .limitFields()
    .paginate();

  const [tours, paginationMetadata] = await Promise.all([
    features.query,
    Tour.getPaginationMetadata({
      filter: features.mongoFilter,
      page: features.paginationInfo?.page,
      limit: features.paginationInfo?.limit,
      estimated: true,
    }),
  ]);

  res.status(httpStatus.OK).json({
    status: responseStatus.SUCCESS,
    message: 'Tours retrieved successfully',
    results: tours.length,
    paginationMetadata,
    data: { tours },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const { body } = req;
  const tour = await Tour.create(body);

  res.status(httpStatus.CREATED).json({
    status: responseStatus.SUCCESS,
    message: 'Tour created successfully',
    data: { tour },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  // Handle case where ID is valid format but tour doesn't exist
  if (!tour) return next(new NotFoundError('No tour found with that ID'));

  res.status(httpStatus.OK).json({
    status: responseStatus.SUCCESS,
    message: `Tour retrieved successfully`,
    data: { tour },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const tour = await Tour.findByIdAndUpdate(id, body, { new: true, runValidators: true });

  // Handle case where ID is valid format but tour doesn't exist
  if (!tour) return next(new NotFoundError('No tour found with that ID'));

  res.status(httpStatus.OK).json({
    status: responseStatus.SUCCESS,
    data: { tour },
    message: 'Tour updated successfully',
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  // Handle case where ID is valid format but tour doesn't exist
  if (!tour) return next(new NotFoundError('No tour found with that ID'));

  res.status(httpStatus.NO_CONTENT).send();
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $facet: {
        overall: [
          {
            $match: {
              ratingsAverage: { $gte: 4.5 },
            },
          },

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

          {
            $sort: { avgPrice: 1 },
          },

          { $project: { _id: 0 } }, // clean output
        ],
        byDifficulty: [
          {
            $match: {
              ratingsAverage: { $gte: 4.7 },
            },
          },

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

          {
            $sort: { avgPrice: 1 },
          },

          {
            $addFields: { difficulty: '$_id' },
          },

          {
            $project: { _id: 0 },
          },
        ],
      },
    },
  ]);

  res.status(httpStatus.OK).json({
    status: responseStatus.SUCCESS,
    data: { stats },
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

  res.status(httpStatus.OK).json({
    status: responseStatus.SUCCESS,
    data: { plan },
  });
});

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};

// const escapeRegex = (text) =>
//   text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// const search = escapeRegex(req.query.search);
