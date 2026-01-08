const Tour = require("../models/tour.model");

const getAllTours = async (req, res) => {
  try {
    // =====================================================
    // 1) BUILD THE FILTER QUERY
    // =====================================================

    // 1.1) Create a shallow copy of req.query
    const queryObj = { ...req.query };

    // 1.2) excluded Fields that should NOT be used for filtering in MongoDB
    const excludedFields = ["page", "limit", "fields", "sort", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1.3) Advanced filtering (gte, gt, lte, lt, ne, in)
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`,
    );

    const mongoFilter = JSON.parse(queryString);

    // 1.4) Optional text search (name + description)
    if (req.query.search) {
      // mongoFilter.$or = [
      //   { name: { $regex: req.query.search, $options: "i" } },
      //   { description: { $regex: req.query.search, $options: "i" } },
      //   { summary: { $regex: req.query.search, $options: "i" } },
      // ];

      mongoFilter.$text = { $search: req.query.search };
    }
    // Start the query
    let query = Tour.find(mongoFilter);

    // =====================================================
    // 2) SORTING
    // =====================================================
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt _id");
    }

    // =====================================================
    // 3) FIELD LIMITING (PROJECTION)
    // =====================================================
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-_v");
    }

    // =====================================================
    // 4) PAGINATION
    // =====================================================
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 24);
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // 4.1) Calculate total documents for pagination metadata
    const totalDocs = await Tour.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const tours = await query;
    return res.status(200).json({
      status: "success",
      result: tours.length,
      message: "Tours retrieved successfully",
      paginationMetaData: {
        currentPage: page,
        totalPages,
        totalResults: totalDocs,
        resultsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },

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
