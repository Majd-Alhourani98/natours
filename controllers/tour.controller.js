const Tour = require('../models/tour.model');

const getAllTours = async (req, res) => {
  const queryObj = { ...req.query };
  const excludedField = ['page', 'limit', 'sort', 'fields', 'search'];
  excludedField.forEach((field) => delete queryObj[field]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const mongoFilter = JSON.parse(queryStr);

  if (req.query.search) {
    mongoFilter.$text = { $search: req.query.search };
  }

  let query = Tour.find(mongoFilter);

  if (req.query.search && !req.query.sort) {
    query = query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
  } else if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt _id');
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 12, 100);
  const skip = (page - 1) * limit;

  const totalDocs = await Tour.countDocuments(mongoFilter);
  const totalPages = Math.ceil(totalDocs / limit);

  const paginationMetaData = {
    totalDocs,
    totalPages,
    currentPage: page,
    limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };

  query = query.skip(skip).limit(limit);

  try {
    const tours = await query;
    res.status(200).json({
      status: 'success',
      message: 'Tours retrieved successfully',
      results: tours.length,
      paginationMetaData,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const { body } = req;
    const tour = await Tour.create(body);

    res.status(201).json({
      status: 'success',
      message: 'Tour created successfully',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    // Handle case where ID is valid format but tour doesn't exist
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Tour retrieved successfully`,
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const tour = await Tour.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    // Handle case where ID is valid format but tour doesn't exist
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { tour },
      message: 'Tour updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    // Handle case where ID is valid format but tour doesn't exist
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }

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

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};

// const escapeRegex = (text) =>
//   text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// const search = escapeRegex(req.query.search);
