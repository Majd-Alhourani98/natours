const Tour = require('../models/tour.model');

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of tours',
    data: { tours: 'list_of_all_tours' },
    message: 'Tours retrieved successfully',
  });
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

const getTour = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: { tour: 'tour_data_for_id' },
    message: `Tour with ID ${id} retrieved successfully`,
  });
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
