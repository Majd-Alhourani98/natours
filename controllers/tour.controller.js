const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: "<number_of_tours>",
    message: "Tours retrieved successfully",
    data: { tours: "<list_of_tours>" },
  });
};

const createTour = (req, res) => {
  const tour = req.body;

  res.status(201).json({
    status: "success",
    message: "Tour created successfully",
    data: {
      tour: tour,
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    status: "success",
    message: "Tour retrieved successfully",
    data: {
      tour: `<tour_with_${id}>`,
    },
  });
};

const updateTour = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  res.status(200).json({
    status: "success",
    message: "Tour updated successfully",
    data: {
      tour: data, // In a real app, this would be the merged updated tour
    },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  res.status(204).send();
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
