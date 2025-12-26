const catchAsync = require('../errors/handlers/catchAsyncHandler');
const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');

const getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

  const [tours, paginationMetaData] = await Promise.all([
    features.query,
    Tour.getPaginationMeta({ filter: features.mongoFilter }),
  ]);

  res.status(200).json({
    success: true,
    message: 'Tours retrieved successfully',
    results: tours.length,
    paginationMetaData: paginationMetaData,
    data: { tours },
  });
});

const getTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);
  res.status(200).json({
    success: true,
    message: 'Tour retrieved successfully',
    data: { tour },
  });
});

const createTour = catchAsync(async (req, res) => {
  const data = req.body;

  const tour = await Tour.create(data);
  res.status(201).json({
    success: true,
    message: 'Tour created successfully',
    data: { tour },
  });
});

const updateTour = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const tour = await Tour.findByIdAndUpdate(id, data, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    success: true,
    message: 'Tour updated successfully',
    data: { tour },
  });
});

const deleteTour = catchAsync(async (req, res) => {
  const { id } = req.params;

  await Tour.findByIdAndDelete(id);
  res.status(204).json();
});

const getTopFiveCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

const getToursStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              avgRatings: { $avg: '$ratingsAverage' },
              minRatings: { $min: '$ratingsAverage' },
              maxRatings: { $max: '$ratingsAverage' },

              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },

              numRating: { $sum: '$ratingsQuantity' },
              numTours: { $sum: 1 },
            },
          },
        ],
        byDifficulty: [
          {
            $group: {
              _id: '$difficulty',
              avgRatings: { $avg: '$ratingsAverage' },
              minRatings: { $min: '$ratingsAverage' },
              maxRatings: { $max: '$ratingsAverage' },

              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },

              numRating: { $sum: '$ratingsQuantity' },
              numTours: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);
  res.status(200).json({ success: true, data: { stats } });
});

const getMonthlyPlan = catchAsync(async (req, res) => {
  const { year } = req.params;

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
        numToursStarts: { $sum: 1 },
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
      $sort: { numToursStarts: -1 },
    },

    {
      $limit: 3,
    },
  ]);

  res.status(200).json({ success: true, data: { plan } });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTopFiveCheapTours,
  getToursStats,
  getMonthlyPlan,
};
