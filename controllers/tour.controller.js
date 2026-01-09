const { models } = require('mongoose');
const Tour = require('../models/tour.model');

const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

class APIFeatures {
  constructor(model, query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.model = model;

    this.mongoFilter = {};
    this.paginationInfo = {};
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|ne)\b/g, match => `$${match}`);
    this.mongoFilter = JSON.parse(queryStr);

    this.query = this.query.find(this.mongoFilter);

    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchTerm = escapeRegex(this.queryString.search);

      if (searchTerm.length < 3) {
        throw new Error(`Search term must be at least 3 characters`);
      }

      this.mongoFilter.$text = { $search: searchTerm, $caseSensitive: true };
    }

    this.query = this.query.find(this.mongoFilter);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else if (this.queryString.search) {
      this.query = this.query.sort({ score: { $meta: 'textScore' } });
    } else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.sort('-__v');
    }

    return this;
  }

  paginate() {
    const page = Math.max(Math.floor(Number(this.queryString.page)) || 1, 1);
    const limit = Math.max(Math.floor(Math.min(Number(this.queryString.limit)) || 12, 24), 1);
    const skipBy = (page - 1) * limit;

    this.paginationInfo = { page, limit };
    this.query = this.query.skip(skipBy).limit(limit);

    return this;
  }

  async getPaginationMetaData() {
    const { page, limit } = this.paginationInfo;
    const totalDocs = await this.model.countDocuments(this.mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return {
      totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
      limit,
    };
  }
}

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour, Tour.find(), req.query).filter().search().sort().limitFields().paginate();
    const tours = await features.query;
    const paginationMetaData = await features.getPaginationMetaData();

    return res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: new Date().toISOString(),
      message: 'Tours retrieved successfully',
      paginationMetaData,
      data: { tours },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const data = req.body;

    const tour = await Tour.create(data);

    return res.status(201).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: 'Tour created successfully!',
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findById(id);

    if (!tour) throw new Error('No tour found with that ID');

    return res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour retrieved successfully!`,
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const tour = await Tour.findByIdAndUpdate(id, updates, {
      //   new: true,
      returnDocument: 'after',
      runValidators: true,
    });

    if (!tour) throw new Error('No tour found with that ID');

    return res.status(200).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour updated successfully`,
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) throw new Error('No tour found with that ID');

    // 204 status means 'No Content' - the request was successful but there is no data to send back
    return res.status(204).json({
      status: 'success',
      requestedAt: new Date().toISOString(),
      message: `Tour deleted successfully`,
      data: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
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
