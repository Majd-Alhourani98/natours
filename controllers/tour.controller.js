const AppError = require("../errors/AppError");
const Tour = require("../models/tour.model");
const catchAsync = require("../utils/catchAsync");
const tourService = require("../services/tour.service");

// GET /tours - Get all tours
// Supports filtering, searching, sorting, field limiting, and pagination
const getAllTours = catchAsync(async (req, res, next) => {
  const { tours, paginationMetaData } = await tourService.findAllTours(
    req.query,
  );

  return res.status(200).json({
    status: "success",
    results: tours.length,
    message: "Tours retrieved successfully",
    paginationMetaData,
    data: {
      tours: tours,
    },
  });
});

// POST /tours - Create a new tour
// Expects tour data in request body
const createTour = catchAsync(async (req, res, next) => {
  const data = req.body;
  const tour = await tourService.createNewTour(data);

  return res.status(201).json({
    status: "success",
    message: "Tour created successfully",
    data: {
      tour: tour,
    },
  });
});

// GET /tours/:id - Get a specific tour by ID
// Expects tour ID in request parameters
const getTour = catchAsync(async (req, res, next) => {
  const tour = tourService.findTourById(req.params.id);

  return res.status(200).json({
    status: "success",
    message: "Tour retrieved successfully",
    data: { tour },
  });
});

// PATCH /tours/:id - Update a specific tour by ID
// Expects tour ID in request parameters and updated data in request body

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.updateTourById(req.params.id, req.body);

  return res.status(200).json({
    status: "success",
    message: "Tour updated successfully",
    data: { tour },
  });
});

// DELETE /tours/:id - Delete a specific tour by ID
// Expects tour ID in request parameters
const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.deleteTourById(req.params.id);
  return res.status(204).send();
});

// Middleware to alias top five tours
// Sets query parameters for top five tours
const aliasTopFiveTour = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// GET /tours/stats - Get tour statistics
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await tourService.getTourStats();

  return res.status(200).json({
    status: "success",
    message: "Statistics retrieved successfully",
    data: { stats: stats },
  });
});

// GET /tours/monthly-plan/:year - Get monthly plan for a specific year
// Expects year in request parameters
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);

  const plan = await tourService.getMonthlyPlan(year);

  res.status(200).json({
    status: "success",
    message: "Monthly plan retrieved successfully",
    results: plan.length,
    data: { plan },
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopFiveTour,
  getTourStats,
  getMonthlyPlan,
};
