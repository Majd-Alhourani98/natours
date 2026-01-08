/**
 * A utility class to handle Mongoose query building features
 * such as filtering, searching, sorting, field limiting, and pagination.
 */
class APIFeatures {
  /**
   * @param {Object} query - The Mongoose Query object (e.g., Tour.find())
   * @param {Object} queryString - The request query object from Express (req.query)
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.mongoFilter = {}; // Holds the cumulative filter logic for countDocuments()
  }

  /**
   * 1) Advanced Filtering
   * Removes non-filter fields and converts operators (gte, lt, etc.) into MongoDB $ format.
   */
  filter() {
    // Create a copy of query object to avoid mutating the original req.query
    const queryObj = { ...this.queryString };

    // Define fields that are handled by other methods
    const excludedFields = ["page", "limit", "fields", "sort", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert operators to MongoDB syntax: gte -> $gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne|in|nin)\b/g,
      (match) => `$${match}`,
    );

    // Merge new filters with existing ones and apply to the Mongoose query
    this.mongoFilter = { ...this.mongoFilter, ...JSON.parse(queryStr) };
    this.query = this.query.find(this.mongoFilter);

    return this; // Allows for method chaining
  }

  /**
   * 2) Full-Text Search
   * Utilizes MongoDB's text index to search across indexed fields.
   */
  search() {
    if (this.queryString.search) {
      // Add text search to the filter object
      this.mongoFilter.$text = { $search: this.queryString.search };
      this.query = this.query.find(this.mongoFilter);
    }
    return this;
  }

  /**
   * 3) Sorting
   * Sorts results by a user-provided field or defaults to newest-first.
   */
  sort() {
    if (this.queryString.sort) {
      // Split comma-separated string from URL into space-separated string for Mongoose
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default: Sort by newest created date; include _id to ensure consistent pagination
      this.query = this.query.sort("-createdAt _id");
    }
    return this;
  }

  /**
   * 4) Field Limiting (Projection)
   * Limits the returned fields to reduce payload size.
   */
  select() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // Default: Exclude the Mongoose internal version key (__v)
      this.query = this.query.select("-__v");
    }
    return this;
  }

  /**
   * 5) Pagination
   * Limits results and skips documents based on page and limit parameters.
   */
  paginate() {
    const page = Number(this.queryString.page) || 1;
    // Cap the limit to 24 to prevent heavy database load
    const limit = Math.min(Number(this.queryString.limit) || 12, 24);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
