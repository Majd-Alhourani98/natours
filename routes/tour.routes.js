const express = require('express');
const tourController = require('./../controllers/tour.controller');

const router = express.Router();

// --- Route Parameter Middleware ---
// Automatically runs for any route containing the ":id" parameter.
// Useful for validating or transforming parameters before reaching the controller.
router.param('id', tourController.checkID);

// --- Tours Routes ---
// Defines all routes related to the Tour resource.
// This router is mounted in app.js under the path: /api/v1/tours

// @route   GET  /api/v1/tours
// @route   POST /api/v1/tours
// @desc    Retrieve all tours or create a new one
router
  .route('/')
  .get(tourController.getAllTours) // Fetch all tours
  .post(tourController.createTour); // Create a new tour

// @route   GET    /api/v1/tours/:id
// @route   PATCH  /api/v1/tours/:id
// @route   DELETE /api/v1/tours/:id
// @desc    Retrieve, update, or delete a specific tour by ID
router
  .route('/:id')
  .get(tourController.getSingleTour) // Fetch a single tour by ID
  .patch(tourController.updateTour) // Update specific fields of a tour
  .delete(tourController.deleteTour); // Delete a tour by ID

// --- Module Exports ---
// Export the router for mounting in the main application (app.js).
// Keeping routes modular allows for cleaner, scalable architecture.
module.exports = router;
