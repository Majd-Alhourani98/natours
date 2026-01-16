const express = require("express");
const router = express.Router();

const tourController = require("../controllers/tour.controller");
const tourMiddleware = require("../middlewares/tour.middleware");
// router.param("id", (req, res, next, value) => {
//   console.log(`Tour ID is: ${value}`);
//   next();
// });

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/top-five-cheap")
  .get(tourMiddleware.aliasTopFiveTour, tourController.getAllTours);

router.route("/tours-stats").get(tourController.getTourStats);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
