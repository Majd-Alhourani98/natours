const express = require('express');
const app = express();

// Middleware
app.use(express.json());

/**
 * --- Route Handlers ---
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
 * --- Route Definitions ---
 */

app.get('/api/v1/tours', getAllTours);
app.post('/api/v1/tours', createTour);

app.get('/api/v1/tours/:id', getTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

// --- Server Initialization ---

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n${'━'.repeat(21)} SERVER ${'━'.repeat(21)}`);
  console.log(`🔗 LINK: http://localhost:${PORT}`);
  console.log(`⏰ STARTED AT: ${new Date().toLocaleString()}\n`);
});
