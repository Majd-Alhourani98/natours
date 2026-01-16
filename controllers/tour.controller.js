const tourService = require("../services/tour.service");
const catchAsync = require("../utils/catchAsync");
const sendResponse = require("../utils/sendResponse");

// GET /tours - Get all tours
const getAllTours = catchAsync(async (req, res, next) => {
  const { tours, paginationMetaData } = await tourService.findAllTours(
    req.query,
  );

  sendResponse(res, {
    data: { tours },
    message: "Tours retrieved successfully",
    paginationMetaData,
  });
});

// POST /tours - Create a new tour
const createTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.createNewTour(req.body);

  sendResponse(res, {
    statusCode: 201,
    data: { tour },
    message: "Tour created successfully",
  });
});

// GET /tours/:id - Get a specific tour by ID
const getTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.findTourById(req.params.id);

  sendResponse(res, {
    data: { tour },
    message: "Tour retrieved successfully",
  });
});

// PATCH /tours/:id - Update a specific tour by ID
const updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourService.updateTourById(req.params.id, req.body);

  sendResponse(res, {
    data: { tour },
    message: "Tour updated successfully",
  });
});

// DELETE /tours/:id - Delete a specific tour by ID
const deleteTour = catchAsync(async (req, res, next) => {
  await tourService.deleteTourById(req.params.id);

  sendResponse(res, {
    statusCode: 204,
    data: null,
    message: "Tour deleted successfully",
  });
});

// GET /tours/stats - Get tour statistics
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await tourService.getTourStats();

  sendResponse(res, {
    data: { stats },
    message: "Statistics retrieved successfully",
  });
});

// GET /tours/monthly-plan/:year - Get monthly plan
const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const plan = await tourService.getMonthlyPlan(Number(req.params.year));

  sendResponse(res, {
    data: { plan },
    message: "Monthly plan retrieved successfully",
    results: plan.length,
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
