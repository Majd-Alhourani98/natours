const Tour = require("../models/tour.model");

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(201).json({
      status: "success",
      result: tours.length,
      message: "Tours retrieved successfully",
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const data = req.body;
    const tour = await Tour.create(data);

    res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);
    res.status(201).json({
      status: "success",
      message: "Tour retrieved successfully",
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
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
