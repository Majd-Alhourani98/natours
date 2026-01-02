const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: '<number_of_tours_placeholder>',
    message: 'Tours retrieved successfully.',
    data: {
      tours: '<tours_list_placeholder>',
    },
  });
};

const createTour = (req, res) => {
  const payload = req.body;

  // Placeholder for creation logic (DB, validation, etc.)
  const createdTour = payload;

  res.status(201).json({
    status: 'success',
    message: 'Tour created successfully.',
    data: {
      tour: '<created_tour_placeholder>',
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `Tour with id "${id}" retrieved successfully.`,
    data: {
      tour: '<tour_placeholder>',
    },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: 'success',
    message: `Tour with id "${id}" updated successfully.`,
    data: {
      tour: '<updated_tour_placeholder>',
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
