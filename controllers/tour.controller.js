const Tour = require('../models/tour.model');
const { APIFeatures } = require('../utils/APIFeatures');

const getPaginateMetaData = async (paginationInfo, mongoFilter) => {
  const { page, limit } = paginationInfo;
  const totalDocs = await Tour.countDocuments(mongoFilter);
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalResults: totalDocs,
    resultsPerPage: limit,
    hasNextPage,
    hasPrevPage,
  };
};

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query, Tour)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
    const paginateMetaData = await getPaginateMetaData(
      features.paginationInfo,
      features.mongoFilter
    );

    return res.status(200).json({
      status: 'success',
      result: tours.length,
      message: 'Tours retrieved successfully.',
      paginateMetaData,
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
