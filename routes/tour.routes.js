// Import Express framework
const express = require('express');

// Import tour controller functions to handle requests
const tourController = require('../controllers/tour.controller');

// Create a new Express router instance
const router = express.Router();

router.param('id', tourController.checkID);
// Define routes for '/api/v1/tours'

// Route for '/' (root of tours)
// GET  -> get all tours
// POST -> create a new tour
router.route('/').get(tourController.getAllTours).post(tourController.createTour);

// Route for '/:id' (specific tour by ID)
// GET    -> get a single tour by ID
// PATCH  -> update a tour
// DELETE -> delete a tour
router
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// Export the router to be used in the main app
module.exports = router;
