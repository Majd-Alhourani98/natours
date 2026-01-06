const Tour = require('../models/tour.model');

class APIFeatures {
  constructor(query, queryString, model) {
    this.query = query;
    this.queryString = queryString;
    this.mongoFilter = {};
    this.paginationInfo = {};
    this.model = model;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|in|ne)\b/g, match => `$${match}`);

    this.mongoFilter = JSON.parse(queryStr);

    this.query = this.query.find(this.mongoFilter);
    return this;
  }

  search() {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search;
      this.mongoFilter.$text = { $search: searchTerm };

      console.log(this.mongoFilter);

      this.query = this.query.find(this.mongoFilter);

      return this;
    }
  }

  sort() {
    if (this.queryString.sort) {
      console.log('sort');
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else if (this.queryString.search) {
      console.log('sort 1');

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
      this.query = this.query.select('-__v -createdAt -updatedAt');
    }

    return this;
  }

  paginate() {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(Number(this.queryString.limit) || 12, 24); // default 12, max 100
    const skipBy = (page - 1) * limit;
    this.query = this.query.skip(skipBy).limit(limit);

    this.paginationInfo = { page, limit };

    return this;
  }

  async getPaginateMetaData() {
    const { page, limit } = this.paginationInfo;
    const totalDocs = await this.model.countDocuments(this.mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      currentPage: page,
      totalPages,
      totalResults: totalDocs,
      resultsPerPage: limit,
      hasNextPage,
      hasPrevPage,
    };
  }
}

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query, Tour)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
    const paginateMetaData = await features.getPaginateMetaData();

    return res.status(200).json({
      status: 'success',
      result: tours.length,
      message: 'Tours retrieved successfully.',
      paginateMetaData,
      data: {
        tours: tours,
      },
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
    const { body: payload } = req;
    const tour = await Tour.create(payload);

    return res.status(201).json({
      status: 'success',
      message: 'Tour created successfully.',
      data: {
        tour: tour,
      },
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
    const { id } = req.params;

    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour found with id "${id}".`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Tour retrieved successfully.`,
      data: {
        tour: tour,
      },
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
    const { id } = req.params;
    const { body: payload } = req;

    const tour = await Tour.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour found with id "${id}".`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Tour updated successfully.`,
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
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
        status: 'fail',
        message: `No tour found with id "${id}".`,
      });
    }

    res.status(204).json();
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
};
