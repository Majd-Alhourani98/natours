// =============================
// SERVER SETUP
// =============================

// Import required modules
const fs = require('fs'); // File system module for reading/writing JSON files
const express = require('express'); // Express framework
const app = express();

// Middleware: parse incoming JSON requests and attach to req.body
app.use(express.json());

// =============================
// DATA LOADING
// =============================

// Load and parse tours data from local JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =============================
// CONTROLLER FUNCTIONS
// =============================

// GET /api/v1/tours → returns all tours
const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    results: tours.length, // total number of tours
    data: { tours }, // shorthand for { tours: tours }
  });
};

// GET /api/v1/tours/:id → returns a single tour by ID
const getSingleTour = (req, res) => {
  const id = Number(req.params.id); // convert ID param from string to number

  // Validate ID range
  if (id > tours.length || id < 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Find the tour with the matching ID
  const tour = tours.find(tour => tour.id === id);

  // Return the found tour
  return res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

// POST /api/v1/tours → create a new tour
const createTour = (req, res) => {
  // Generate new ID based on last tour's ID
  const id = tours[tours.length - 1].id + 1;

  // Combine new ID with request body data
  const newTour = { id, ...req.body };

  // Add new tour to in-memory array
  tours.push(newTour);

  // Persist updated data back to the JSON file
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    // Send response after successful write
    return res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  });
};

// PATCH /api/v1/tours/:id → update an existing tour (partial update)
const updateTour = (req, res) => {
  const id = Number(req.params.id);

  // Validate ID range
  if (id > tours.length || id < 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Placeholder response — actual update logic can be implemented later
  return res.status(200).json({
    status: 'success',
    data: { tour: 'Updated tour' },
  });
};

// DELETE /api/v1/tours/:id → delete a tour
const deleteTour = (req, res) => {
  const id = Number(req.params.id);

  // Validate ID range
  if (id > tours.length || id < 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // Successful deletion — send 204 No Content
  return res.status(204).json({
    status: 'success',
    data: null,
  });
};

// =============================
// ROUTES SETUP
// =============================

// Use Express route chaining for cleaner syntax
app
  .route('/api/v1/tours')
  .get(getAllTours) // GET all tours
  .post(createTour); // POST create a new tour

app
  .route('/api/v1/tours/:id')
  .get(getSingleTour) // GET single tour by ID
  .patch(updateTour) // PATCH update tour
  .delete(deleteTour); // DELETE a tour

// =============================
// SERVER LISTEN
// =============================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
