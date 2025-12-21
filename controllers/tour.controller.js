const getAllTours = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tours retrieved successfully',
    results: '<number_of_tours>',
    data: {
      tours: '<list_of_tours>',
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour retrieved successfully',
    data: {
      tour: `<tour with id: ${id}>`,
    },
  });
};

const createTour = (req, res) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    status: 'success',
    message: 'Tour created successfully',
    data: {
      tour: '<newly_created_tour>',
    },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  res.status(200).json({
    success: true,
    status: 'success',
    message: 'Tour updated successfully',
    data: {
      tour: `<updated_tour_with_id_${id}>`,
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).json();
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
