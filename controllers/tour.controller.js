const Tour = require('../models/tour.model');
const { APIFeatures } = require('../utils/APIFeatures');

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour, req.query).build();

    const [tours, paginationMetaData] = await Promise.all([
      features.query,
      Tour.getPaginationMetaData(features.paginationInfo, features.mongoFilter),
    ]);

    return res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: new Date().toISOString(),
      message: 'Tours retrieved successfully',
      paginationMetaData,
      data: { tours },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const data = req.body;

    const tour = await Tour.create(data);

    return res.status(201).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: 'Tour created successfully!',
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findById(id);

    if (!tour) throw new Error('No tour found with that ID');

    return res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour retrieved successfully!`,
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const tour = await Tour.findByIdAndUpdate(id, updates, {
      //   new: true,
      returnDocument: 'after',
      runValidators: true,
    });

    if (!tour) throw new Error('No tour found with that ID');

    return res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour updated successfully`,
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) throw new Error('No tour found with that ID');

    // 204 status means 'No Content' - the request was successful but there is no data to send back
    return res.status(204).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour deleted successfully`,
      data: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getTourStatistics = async (req, res) => {
  try {
    // 1. Whitelist allowed fields to prevent injection
    const allowedGorupByFields = ['difficulty', 'duration', 'price', 'ratingsAverage'];
    const groupBy = allowedGorupByFields.includes(req.query.groupBy) ? req.query.groupBy : 'difficulty';

    const statsGroup = {
      maxPrice: { $max: '$price' },
      avgPrice: { $avg: '$price' },
      minPrice: { $min: '$price' },
      maxRating: { $max: '$ratingsAverage' },
      minRating: { $min: '$ratingsAverage' },
      avgRating: { $avg: '$ratingsAverage' },
      numTours: { $sum: 1 },
    };

    const stats = await Tour.aggregate([
      {
        $facet: {
          overall: [
            { $group: { _id: null, ...statsGroup } },
            { $project: { _id: 0 } },
            { $addFields: { avgPrice: { $round: ['$avgPrice', 1] }, avgRating: { $round: ['$avgRating', 1] } } },
            { $sort: { avgPrice: 1 } },
          ],
          groupBy: [
            { $group: { _id: { $toUpper: `$${groupBy}` }, ...statsGroup } },
            { $addFields: { avgPrice: { $round: ['$avgPrice', 1] }, avgRating: { $round: ['$avgRating', 1] } } },
            { $sort: { avgPrice: 1 } },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: 'Tours Statistics retrieved successfully',
      data: { stats },
    });
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStatistics,
};
