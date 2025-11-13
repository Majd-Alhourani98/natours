// =======================
// IMPORTS
// =======================
const Tour = require('./../models/tour.model');

// =======================
// CONTROLLERS
// =======================

// GET /api/v1/tours
// Fetch all tours and send them in the response
const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = async (req, res) => {};

// POST /api/v1/tours
// Create a new tour
const createTour = async (req, res) => {
  try {
    // Tour.create({}).then().catch();
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data',
    });
  }
};

// PATCH /api/v1/tours/:id
// Update a tour (currently placeholder)
const updateTour = (req, res) => {};

// DELETE /api/v1/tours/:id
// Delete a tour by ID
const deleteTour = (req, res) => {};

// Export all controller functions for use in routes
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
