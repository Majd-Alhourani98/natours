const Tour = require('../models/tour.model');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: tours.length,
      message: 'Tours retrieved successfully.',
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const { body: payload } = req;
    const tour = await Tour.create(payload);

    res.status(201).json({
      status: 'success',
      message: 'Tour created successfully.',
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

const getTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);

    if (!tour) {
      res.status(404).json({
        status: 'fail',
        message: `No tour found with id "${id}".`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Tour retrieved successfully.`,
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

const updateTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `Tour with id "${id}" updated successfully.`,
    data: {
      tour: '<updated_tour_placeholder>',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
