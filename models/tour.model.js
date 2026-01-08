const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true, // only works for strings
      required: [true, 'A tour must have a summary'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],
    // createdAt: {
    //   type: Date,
    //   default: Date.now(), // give timestamp ==> converted into today's date in mongoose
    // },

    startDates: [Date],
  },
  {
    timestamps: true,
  }
);

// Create a compound text index on the 'name' and 'description' fields.
// This enables full-text search capabilities, allowing for more complex
// queries than standard string matching.
tourSchema.index({
  name: 'text',
  description: 'text',
});

tourSchema.statics.getPaginationMetadata = async function ({ filter = {}, page = 1, limit = 12 }) {
  // 1. Safety check for the limit to avoid Division by Zero
  const safeLimit = Math.max(Number(limit) || 12, 1);
  const safePage = Math.max(Number(page) || 1, 1);

  // 2. Execute count
  const totalDocs = await this.countDocuments(filter);

  // 3. Calculate core pagination values
  const totalPages = Math.ceil(totalDocs / safeLimit) || 0;

  // 4. Calculate item ranges (Great for "Showing X to Y of Z" labels)
  const pagingCounter = (safePage - 1) * safeLimit + 1;
  // Ensure we don't show a 'to' value higher than the total documents
  const toItem = Math.min(safePage * safeLimit, totalDocs);

  return {
    totalDocs,
    totalPages,
    currentPage: safePage,
    limit: safeLimit,
    // Range metadata
    pagingCounter: totalDocs === 0 ? 0 : pagingCounter,
    toItem: totalDocs === 0 ? 0 : toItem,
    // Boolean helpers
    hasNextPage: safePage < totalPages,
    hasPrevPage: safePage > 1,
    // Navigation links/indices
    nextPage: safePage < totalPages ? safePage + 1 : null,
    prevPage: safePage > 1 ? safePage - 1 : null,
  };
};

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
