const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: 'number of tours',
    requestedAt: new Date().toISOString(),
    message: 'Tours retrieved successfully',
    data: {
      tours: 'list of tours',
    },
  });
};

const createTour = (req, res) => {
  const data = req.body;

  console.log('New Tour Data Received:', data);

  res.status(201).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: 'Tour created successfully!',
    data: {
      tour: data,
    },
  });
};

const getTour = (req, res) => {
  // Access the ID from the URL parameters
  const id = req.params.id;

  console.log(`Searching for tour with ID: ${id}`);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} retrieved successfully!`,
    data: {
      tour: `Details for tour ${id}`,
    },
  });
};

const updateTour = (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  console.log(`Updating tour ${id} with:`, updates);

  res.status(200).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} updated successfully`,
    data: {
      tour: 'updated tour details',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id;

  console.log(`Deleting tour with ID: ${id}`);

  // 204 status means 'No Content' - the request was successful but there is no data to send back
  res.status(204).json({
    status: 'success',
    requestedAt: new Date().toISOString(),
    message: `Tour ${id} deleted successfully`,
    data: null,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
