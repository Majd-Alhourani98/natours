const express = require("express");
const router = express.Router();

const tourController = require("../controllers/tour.controller");

router.param("id", (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);
  next();

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
