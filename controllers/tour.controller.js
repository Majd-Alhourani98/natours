const User = require('../models/tour.model');

const getAllTours = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tours retrieved successfully',
    results: '<number_of_tours>',
    data: {
      tours: '<list_of_tours>',
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour retrieved successfully',
    data: {
      tour: `<tour with id: ${id}>`,
    },
  });
};

const createTour = async (req, res) => {
  const data = req.body;
  try {
    const tour = await User.create(data);
    res.status(201).json({
      success: true,
      status: 'success',
      message: 'Tour created successfully',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      status: 'fail',
      data: error.message,
    });
  }
};

const updateTour = (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour updated successfully',
    data: {
      tour: `<updated_tour_with_id_${id}>`,
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
