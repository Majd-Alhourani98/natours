// =======================
// IMPORTS
// =======================
const Tour = require('./../models/tour.model');

// =======================
// CONTROLLERS
// =======================

// GET /api/v1/tours
// Fetch all tours and send them in the response
const getAllTours = async (req, res) => {
  try {
    // ================================
    // BUILD THE QUERY
    // ================================

    // 1) Clone query and remove non-filter fields
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // 2) Advanced Filtering: convert gte, gt, lte, lt to MongoDB operators
    // 2.1) Convert query object to a string
    let queryStr = JSON.stringify(queryObj);
    // 2.2) Replace operators like gte, gt, lte, lt with MongoDB operators
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in)\b/g, match => `$${match}`);
    // 2.3) Convert the string back to an object
    const mongoFilter = JSON.parse(queryStr);

    // 2.4) Text search support
    if (req.query.search) {
      mongoFilter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    let query = Tour.find(mongoFilter);

    // 3) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // by default sort by newest
      query = query.sort('-createdAt');
    }

    // 4) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields + ' ' + '-createdAt -updatedAt'); // projecting
    } else {
      query = query.select('-__v -createdAt -updatedAt');
    }

    // 5) Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const totalDocs = await Tour.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (skip >= totalDocs && totalDocs > 0) {
      throw new Error('This page does not exist');
    }

    // Execute the Query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      pagination: {
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
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// GET /api/v1/tours/:id
// Fetch a single tour by ID
const getSingleTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    // Tour.findOne({ _id: id });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// POST /api/v1/tours
// Create a new tour
const createTour = async (req, res) => {
  try {
    // Tour.create({}).then().catch();
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// PATCH /api/v1/tours/:id
// Update a tour (currently placeholder)
const updateTour = async (req, res) => {
  const { id } = req.params;
  const { body } = req;

  try {
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true, // return the new documnet
      runValidators: true, // run validator
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data',
    });
  }
};

// DELETE /api/v1/tours/:id
// Delete a tour by ID
const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

// Export all controller functions for use in routes
module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
