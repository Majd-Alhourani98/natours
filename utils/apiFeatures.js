class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.mongoFilter = {};
    this.paginationInfo = {};
  }

  /**
   * Advanced Filtering
   * Cleans the query string and converts operators (gte, lt, etc.) into MongoDB syntax.
   */
  filter() {
    // 1) Create a copy of the query object to avoid mutating the original
    const queryObj = { ...this.queryString };

    // 2) Remove fields that are not part of the database schema
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 3) Convert shorthand operators to MongoDB $operators using Regex
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne|in)\b/g, (match) => `$${match}`);

    // 4) Save the filter and apply it to the Mongoose query
    this.mongoFilter = JSON.parse(queryStr);

    return this;
  }

  /**
   * Text Search Logic
   * Injects a $text search into the filter if a search term is present in the URL.
   */
  search() {
    if (this.queryString.search) {
      // Add the search term to our filter object
      this.mongoFilter.$text = { $search: this.queryString.search };
      // Update the query with the new search filter
    }
    return this;
  }

  applyFilter() {
    this.query = this.query.find(this.mongoFilter);
    return this;
  }

  /**
   * Sorting Logic
   * Manages the order of results based on search relevance, user preference, or date.
   */
  sort() {
    // 1) SEARCH RELEVANCE: If searching and no sort is provided, use MongoDB textScore
    if (this.queryString.search && !this.queryString.sort) {
      this.query = this.query
        .select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    }
    // 2) CUSTOM SORT: If user provides a sort parameter (e.g., ?sort=price,-rating)
    else if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    // 3) DEFAULT SORT: Newest items first, using _id as a secondary sort for stability
    else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  /**
   * Field Limiting
   * Restricts the fields returned in the response to save bandwidth.
   */
  limitFields() {
    if (this.queryString.fields) {
      // Transform comma-separated fields into space-separated for Mongoose
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Exclude the __v field by default for cleaner data
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Pagination Logic
   * Calculates how many documents to skip and limits the number of results per page.
   */
  paginate() {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(Number(this.queryString.limit) || 12, 100);
    const skip = (page - 1) * limit;

    // Save pagination details for the metadata generator later
    this.paginationInfo = { page, limit };
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

// Should be "Pure Functions" (input goes in, output comes out, no side effects, no database calls).
