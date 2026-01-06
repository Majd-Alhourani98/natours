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

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
