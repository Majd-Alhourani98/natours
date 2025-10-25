// Core Node.js module for file operations (reading/writing data files)
const fs = require('fs');

// Read and parse tours data from the JSON file (synchronously for simplicity)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// --- Tours Controllers ---

// @desc   Get all tours
// @route  GET /api/v1/tours
const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// @desc   Get a single tour by ID
// @route  GET /api/v1/tours/:id
const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((t) => t.id === id);

  // If the tour doesn't exist, return 404
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// @desc   Create a new tour
// @route  POST /api/v1/tours
const createTour = (req, res) => {
  // Auto-generate ID based on last element
  const id = tours[tours.length - 1].id + 1;
  const newTour = { id, ...req.body };
  tours.push(newTour);

  // Save updated tours data to JSON file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

// @desc   Update an existing tour
// @route  PATCH /api/v1/tours/:id
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  // Placeholder response — actual file update logic would go here
  res.status(200).json({
    status: 'success',
    data: { tour: 'UPDATED TOUR' },
  });
};

// @desc   Delete a tour
// @route  DELETE /api/v1/tours/:id
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  // Return 204 for successful deletion with no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
