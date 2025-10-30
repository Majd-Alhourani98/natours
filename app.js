// =============================
// SERVER SETUP
// =============================

// Import required modules
const fs = require('fs');
const express = require('express');
const app = express();

// Middleware: parse incoming JSON requests
app.use(express.json());

// =============================
// GLOBAL MIDDLEWARE
// =============================

// Logs every incoming request
app.use((req, res, next) => {
  console.log('Global Middleware: Request received');
  next(); // Pass control to next middleware/route handler
});

// Adds a request timestamp to req
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // Important: do not end the response here
});

// =============================
// DATA LOADING
// =============================

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// =============================
// CONTROLLER FUNCTIONS
// =============================

// GET /api/v1/tours
const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // shows the timestamp from middleware
    results: tours.length,
    data: { tours },
  });
};

// GET /api/v1/tours/:id
const getSingleTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length || id < 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const tour = tours.find(tour => tour.id === id);
  return res.status(200).json({ status: 'success', data: { tour } });
};

// POST /api/v1/tours
const createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const newTour = { id, ...req.body };
  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    return res.status(201).json({ status: 'success', data: { tour: newTour } });
  });
};

// PATCH /api/v1/tours/:id
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length || id < 1) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  return res.status(200).json({ status: 'success', data: { tour: 'Updated tour' } });
};

// DELETE /api/v1/tours/:id
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length || id < 1) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  return res.status(204).json({ status: 'success', data: null });
};

// =============================
// ROUTES SETUP
// =============================

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getSingleTour).patch(updateTour).delete(deleteTour);

// =============================
// SERVER LISTEN
// =============================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
