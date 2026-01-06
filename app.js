const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());

// HTTP request logger middleware
app.use(morgan('dev'));

/**
 * --- Tours Route Handlers ---
 * Logic separated from the route definitions
 */

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of tours',
    data: { tours: 'list_of_all_tours' },
    message: 'Tours retrieved successfully',
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: { tour: 'newly_created_tour' },
    message: 'Tour created successfully',
  });
};

const getTour = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: { tour: 'tour_data_for_id' },
    message: `Tour with ID ${id} retrieved successfully`,
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    status: 'success',
    data: { tour: 'updated_tour_data_for_id' },
    message: `Tour with ID ${id} updated successfully`,
  });
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

/**
 * --- Users Route Handlers ---
 * Logic separated from the route definitions
 */

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};

const getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'This route is not yet defined' });
};
/**
 * --- Route Definitions ---
 */

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// --- Server Initialization ---

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);
  console.log(`🔗 LINK: http://localhost:${PORT}`);
  console.log(`⏰ STARTED AT: ${new Date().toLocaleString()}\n`);
});
