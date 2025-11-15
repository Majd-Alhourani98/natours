// =======================
// IMPORTS
// =======================
const Tour = require('./../models/tour.model');
const APIFeatures = require('./../utils/apiFeatures');

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
const getAllTours = async (req, res) => {
  try {
    // Build query using APIFeatures class with method chaining
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    // Tour.findOne({ _id: id });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// POST /api/v1/tours
// Create a new tour
const createTour = async (req, res) => {
  try {
    // Tour.create({}).then().catch();
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// PATCH /api/v1/tours/:id
// Update a tour (currently placeholder)
const updateTour = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true, // return the new documnet
      runValidators: true, // run validator
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data',
    });
  }
};

// DELETE /api/v1/tours/:id
// Delete a tour by ID
const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

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
