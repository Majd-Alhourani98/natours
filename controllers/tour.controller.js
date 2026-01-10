const catchAsync = require('../errors/catchAsync');
const Tour = require('../models/tour.model');
const { APIFeatures } = require('../utils/APIFeatures');

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query, Tour).build();

  const [tours, paginateMetaData] = await Promise.all([
    features.query,
    Tour.getPaginateMetaData(features.paginationInfo, features.mongoFilter),
  ]);

  return res.status(200).json({
    status: 'success',
    result: tours.length,
    message: 'Tours retrieved successfully.',
    paginateMetaData,
    data: {
      tours: tours,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const { body: payload } = req;
  const tour = await Tour.create(payload);

  return res.status(201).json({
    status: 'success',
    message: 'Tour created successfully.',
    data: {
      tour: tour,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id "${id}".`,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: `Tour retrieved successfully.`,
    data: {
      tour: tour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { body: payload } = req;

  const tour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id "${id}".`,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: `Tour updated successfully.`,
    data: {
      tour: tour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `No tour found with id "${id}".`,
    });
  }

  return res.status(200).json({
    status: 'success',
    message: `Tour updated successfully.`,
    data: {
      tour: tour,
    },
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const groupBy = req.query.groupBy || 'difficulty';
  const sortBy = req.query.sortBy || 'avgPrice';
  const ascending = req.query.ascending !== 'false';

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

          {
            $addFields: {
              avgPrice: { $round: ['$avgPrice', 2] },
              avgRating: { $round: ['$avgRating', 2] },
            },
          },

          {
            $sort: {
              [sortBy]: ascending ? 1 : -1,
            },
          },

          {
            $project: {
              _id: 0,
            },
          },
        ],

        byGroup: [
          {
            $group: {
              _id: { $toUpper: `$${groupBy}` },
              avgRating: { $avg: '$ratingsAverage' },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
              numRating: { $sum: '$ratingsQuantity' },
              numTours: { $sum: 1 },
            },
          },

          {
            $addFields: {
              avgPrice: { $round: ['$avgPrice', 2] },
              avgRating: { $round: ['$avgRating', 2] },
            },
          },

          {
            $sort: {
              [sortBy]: ascending ? 1 : -1,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    message: `Tour stats successfully.`,
    data: { stats: stats },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  if (!Number.isInteger(year) || year < 2021 || year > 2040) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid year parameter',
    });
  }

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },

    {
      $match: {
        startDates: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31),
        },
      },
    },

    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },

    {
      $addFields: {
        month: {
          $let: {
            vars: {
              monthsInString: [
                '',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ],
            },
            in: { $arrayElemAt: ['$$monthsInString', '$_id'] },
          },
        },
      },
    },

    {
      $project: { _id: 0 },
    },

    {
      $sort: { numTours: -1 },
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

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
