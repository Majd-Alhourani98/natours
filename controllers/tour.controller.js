const getAllTours = (req, res) => {
  return res.status(200).json({
    status: 'success',
    result: '<number_of_tours>',
    message: 'Tours retrieved successfully',
    data: { tours: '<list_of_tours>' },
  });
};

const createTour = (req, res) => {
  const { body: data } = req;

  console.log(data);

  return res.status(201).json({
    status: 'success',
    message: 'Tour created successfully',
    data: { tour: '<newly_created_tour>' },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(200).json({
    status: 'success',
    message: 'Tour retrieved successfully',
    data: { tour: '<tour>' },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  const { body: data } = req;

  console.log(id);
  console.log(data);

  return res.status(200).json({
    status: 'success',
    message: 'Tour updated successfully',
    data: { tour: '<tour>' },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  console.log(id);

  return res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully',
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
