const Tour = require('../models/tour.model');

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|ne)\b/g, match => `$${match}`);
    const mongoFilter = JSON.parse(queryStr);

    if (req.query.search) {
      const searchTerm = escapeRegex(req.query.search);

      if (searchTerm.length < 3) {
        throw new Error(`Search term must be at least 3 characters`);
      }

      mongoFilter.$text = { $search: searchTerm, $caseSensitive: true };
    }

    let query = Tour.find(mongoFilter);

    const tours = await query;

    return res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: new Date().toISOString(),
      message: 'Tours retrieved successfully',
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

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
