const Tour = require('../models/tour.model');

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const mongoFilter = JSON.parse(queryStr);

    if (req.query.search) {
      const searchTerm = req.query.search;
      mongoFilter.$text = { $search: searchTerm };
    }

    let query = Tour.find(mongoFilter);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else if (req.query.search) {
      query = query.sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort('-createdAt _id');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v -createdAt -updatedAt');
    }

    // pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 12, 24); // default 12, max 100
    const skipBy = (page - 1) * limit;
    query = query.skip(skipBy).limit(limit);

    const totalDocs = await Tour.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const tours = await query;

    return res.status(200).json({
      status: 'success',
      result: tours.length,
      message: 'Tours retrieved successfully.',
      paginationMetaData: {
        currentPage: page,
        totalPages,
        totalResults: totalDocs,
        resultsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
      data: {
        tours: tours,
      },
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
    const { body: payload } = req;
    const tour = await Tour.create(payload);

    return res.status(201).json({
      status: 'success',
      message: 'Tour created successfully.',
      data: {
        tour: tour,
      },
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
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour found with id "${id}".`,
      });
    }

    res.status(204).json();
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

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
};
