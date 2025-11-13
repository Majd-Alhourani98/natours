// =======================
// IMPORTS
// =======================
const Tour = require('./../models/tour.model');

// =======================
// CONTROLLERS
// =======================

// GET /api/v1/tours
// Fetch all tours and send them in the response
const getAllTours = (req, res) => {};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = (req, res) => {};

// POST /api/v1/tours
// Create a new tour
const createTour = (req, res) => {};

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
