const express = require('express');
const tourController = require('../controllers/tour.controller');

const router = express.Router();

// Param middleware
router.param('id', (req, res, next, value) => {
  console.log(value);

  next();
});

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/tours-stats').get(tourController.getTourStats);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
