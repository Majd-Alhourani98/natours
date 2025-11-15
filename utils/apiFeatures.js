class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.mongoFilter = {};
  }

  filter() {
    // 1) Clone query and remove non-filter fields
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);

    // 2) Advanced Filtering: convert gte, gt, lte, lt to MongoDB operators
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in)\b/g, match => `$${match}`);
    this.mongoFilter = JSON.parse(queryStr);

    // 3) Text search support
    if (this.queryString.search) {
      this.mongoFilter.$or = [
        { name: { $regex: this.queryString.search, $options: 'i' } },
        { description: { $regex: this.queryString.search, $options: 'i' } },
      ];
    }

    this.query = this.query.find(this.mongoFilter);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // by default sort by newest
      this.query = this.query.sort('-createdAt');
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
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // Store pagination info for later use
    this.paginationInfo = { page, limit, skip };
    return this;
  }

  async getPaginationMetadata(Model) {
    const { page, limit, skip } = this.paginationInfo;
    const totalDocs = await Model.countDocuments(this.mongoFilter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (skip >= totalDocs && totalDocs > 0) {
      throw new Error('This page does not exist');
    }

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

module.exports = APIFeatures;
