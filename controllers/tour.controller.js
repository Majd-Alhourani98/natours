const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');

const getAllTours = async (req, res) => {
  try {
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

    res.status(200).json({
      status: 'success',
      message: 'Tours retrieved successfully',
      results: tours.length,
      paginationMetadata,
      data: { tours },
    });
  } catch (error) {
    console.log(error);
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
