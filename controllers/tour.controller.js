const Tour = require('../models/tour.model');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: new Date().toISOString(),
      message: 'Tours retrieved successfully',
      data: { tours },
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
    const data = req.body;

    const tour = await Tour.create(data);

    res.status(201).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: 'Tour created successfully!',
      data: { tour },
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
    const id = req.params.id;

    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour retrieved successfully!`,
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateTour = (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  console.log(`Updating tour ${id} with:`, updates);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} updated successfully`,
    data: {
      tour: 'updated tour details',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id;

  console.log(`Deleting tour with ID: ${id}`);

  // 204 status means 'No Content' - the request was successful but there is no data to send back
  res.status(204).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} deleted successfully`,
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
