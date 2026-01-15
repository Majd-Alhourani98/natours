const express = require('express');

const tourController = require('../controllers/tour.controller');

const router = express.Router();

router.param('id', (req, res, next, value) => {
  console.log(value);

  next();
});

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/stats').get(tourController.getTourStatistics);
router.route('/top-five-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = router;
