const Tour = require('../models/tour.model');
const { escapeRegex } = require('../utils/regex');

class APIFeatures {
  // Static Constants for Query Configuration
  static EXCLUDED_FIELDS = ['page', 'limit', 'sort', 'fields', 'search'];
  static MONGO_OPERATORS_REGEX = /\b(gte|gt|lte|lt|in|ne)\b/g;

  // Search Configuration
  static MIN_SEARCH_LENGTH = 3;

  // Sorting Defaults
  static DEFAULT_SORT = '-createdAt _id';
  static DEFAULT_FIELD_EXCLUSION = '-__v';

  // Pagination Defaults
  static DEFAULT_PAGE = 1;
  static DEFAULT_LIMIT = 12;
  static MAX_LIMIT = 24;

  constructor(model, queryString) {
    this.queryString = queryString;
    this.model = model;

    this.query = model.find();

    this.mongoFilter = {};
    this.paginationInfo = {};
  }

  #filter() {
    const queryObj = { ...this.queryString };

    // Use static constant for excluded fields
    APIFeatures.EXCLUDED_FIELDS.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    // Use static regex for operators
    queryStr = queryStr.replace(APIFeatures.MONGO_OPERATORS_REGEX, match => `$${match}`);

    this.mongoFilter = JSON.parse(queryStr);

    return this;
  }

  #search() {
    if (this.queryString.search) {
      const searchTerm = escapeRegex(this.queryString.search);

      // Use static constant for validation
      if (searchTerm.length < APIFeatures.MIN_SEARCH_LENGTH) {
        throw new Error(`Search term must be at least ${APIFeatures.MIN_SEARCH_LENGTH} characters`);
      }

      this.mongoFilter.$text = { $search: searchTerm, $caseSensitive: true };
    }

    return this;
  }

  #applyFilter() {
    this.query = this.query.find(this.mongoFilter);

    return this;
  }

  #sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else if (this.queryString.search) {
      this.query = this.query.sort({ score: { $meta: 'textScore' } });
    } else {
      // Use static default sort
      this.query = this.query.sort(APIFeatures.DEFAULT_SORT);
    }

    return this;
  }

  #limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Use static default exclusion
      this.query = this.query.select(APIFeatures.DEFAULT_FIELD_EXCLUSION);
    }

    return this;
  }

  #paginate() {
    const page = Math.max(Math.floor(Number(this.queryString.page)) || APIFeatures.DEFAULT_PAGE, 1);

    // Logic fix: ensures limit is at least 1, and caps it at MAX_LIMIT
    const requestedLimit = Math.floor(Number(this.queryString.limit)) || APIFeatures.DEFAULT_LIMIT;
    const limit = Math.max(Math.min(requestedLimit, APIFeatures.MAX_LIMIT), 1);

    const skipBy = (page - 1) * limit;

    this.paginationInfo = { page, limit };
    this.query = this.query.skip(skipBy).limit(limit);

    return this;
  }

  build() {
    this.#filter().#search().#applyFilter().#sort().#limitFields().#paginate();

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
    const features = new APIFeatures(Tour, req.query).build();
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
