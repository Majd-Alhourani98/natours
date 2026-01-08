const Tour = require("../models/tour.model");
const APIFeatures = require("../utils/apiFeatures");

const getAllTours = async (req, res) => {
  try {
    const featuers = new APIFeatures(Tour.find(), req.query)
      .filter()
      .search()
      .sort()
      .select()
      .paginate();

    const tours = await featuers.query;
    // const [totalDocs, tours] = await Promise.all([
    //   Tour.countDocuments(mongoFilter),
    //   query,
    // ]);

    // const totalPages = Math.ceil(totalDocs / limit);
    // const hasNextPage = page < totalPages;
    // const hasPrevPage = page > 1;

    return res.status(200).json({
      status: "success",
      result: tours.length,
      message: "Tours retrieved successfully",
      // paginationMetaData: {
      //   currentPage: page,
      //   totalPages,
      //   totalResults: totalDocs,
      //   resultsPerPage: limit,
      //   hasNextPage,
      //   hasPrevPage,
      // },

      data: {
        tours: tours,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const data = req.body;
    const tour = await Tour.create(data);

    return res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Tour retrieved successfully",
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
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

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
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
