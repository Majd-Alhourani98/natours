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
}

module.exports = { APIFeatures };
