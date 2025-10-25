const express = require('express');
const tourController = require('./../controllers/tour.controller');

const router = express.Router();

// --- Tours Routes ---
// Defines all routes related to the Tour resource.
// This router is mounted in app.js under the path: /api/v1/tours

// @route   GET  /api/v1/tours
// @route   POST /api/v1/tours
// @desc    Get all tours or create a new tour
router
  .route('/')
  .get(tourController.getAllTours) // Retrieve all tours
  .post(tourController.createTour); // Create a new tour

// @route   GET    /api/v1/tours/:id
// @route   PATCH  /api/v1/tours/:id
// @route   DELETE /api/v1/tours/:id
// @desc    Get, update, or delete a specific tour by ID
router
  .route('/:id')
  .get(tourController.getSingleTour) // Retrieve a single tour
  .patch(tourController.updateTour) // Update specific fields of a tour
  .delete(tourController.deleteTour); // Delete a tour by ID

// --- Module Exports ---
// Export router to be mounted in the main application (server.js or app.js)
module.exports = router;
