const Tour = require('../models/tour.model');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      message: 'Tours retrieved successfully',
      results: tours.length,
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
  const { body } = req;
  try {
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
  const { id } = req.params;
  const tour = await Tour.findById(id);

  // Handle case where ID is valid format but tour doesn't exist
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with that ID',
    });
  }

  try {
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

const updateTour = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: { tour: 'updated_tour_data_for_id' },
    message: `Tour with ID ${id} updated successfully`,
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
