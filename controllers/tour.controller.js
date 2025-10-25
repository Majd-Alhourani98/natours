// =======================
// CORE MODULES
// =======================
const fs = require('fs'); // Native Node.js module for file system operations

// =======================
// MOCK DATA SETUP
// =======================
// Load and parse the tours dataset (synchronously for simplicity).
// In production, this should be replaced with a database call or async read operation.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// =======================
// PARAM MIDDLEWARE
// =======================
// Automatically runs whenever the "id" parameter is present in the route.
// Validates that the requested ID exists before continuing to the next middleware.
const checkID = (req, res, next, value) => {
  if (Number(value) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// =======================
// CONTROLLERS: TOURS
// =======================
// Each controller handles a specific operation for the Tour resource.

// @desc    Retrieve all tours
// @route   GET /api/v1/tours
// @access  Public
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// @desc    Retrieve a single tour by its ID
// @route   GET /api/v1/tours/:id
// @access  Public
const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// @desc    Create a new tour
// @route   POST /api/v1/tours
// @access  Public
const createTour = (req, res) => {
  // Simple ID generation (not concurrency-safe; only for mock data)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);

  // Persist the new data back to the file system (simulated DB write)
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to save tour data',
        });
      }

      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

// @desc    Update an existing tour (partial update)
// @route   PATCH /api/v1/tours/:id
// @access  Public
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  // TODO: Implement partial update logic and persist to file or DB
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATED TOUR (mock)' },
  });
};

// @desc    Delete a tour
// @route   DELETE /api/v1/tours/:id
// @access  Public
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  // TODO: Implement actual deletion and persist changes
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// =======================
// EXPORTS
// =======================
// Export all route handlers for use in the Tours Router
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  checkID,
};
