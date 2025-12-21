const Tour = require('../models/tour.model');

const getAllTours = async (req, res) => {
  const queryObject = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach((field) => delete queryObject[field]);

  let queryString = JSON.stringify(queryObject);
  queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const mongoFilter = JSON.parse(queryString);

  try {
    const tours = await Tour.find(mongoFilter);
    res.status(200).json({
      success: true,
      message: 'Tours retrieved successfully',
      results: tours.length,
      data: { tours },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error.message,
    });
  }
};

const getTour = async (req, res) => {
  const { id } = req.params;

  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      success: true,
      message: 'Tour retrieved successfully',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error.message,
    });
  }
};

const createTour = async (req, res) => {
  const data = req.body;
  try {
    const tour = await User.create(data);
    res.status(201).json({
      success: true,
      message: 'Tour created successfully',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const tour = await Tour.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      success: true,
      status: 'success',
      message: 'Tour updated successfully',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};

// envelope pattern
