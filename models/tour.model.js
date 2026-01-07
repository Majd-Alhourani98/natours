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

    startDates: [Date],
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
// Weights prioritize name/summary over description
tourSchema.index(
  { name: 'text', description: 'text', summary: 'text' },
  {
    weights: { name: 10, summary: 5, description: 1 },
    name: 'TourTextIndex',
  }
);

tourSchema.statics.getPaginateMetaData = async function (paginationInfo, mongoFilter) {
  const { page, limit } = paginationInfo;

  let totalDocs;

  if (Object.keys(mongoFilter).length > 0) {
    totalDocs = await this.countDocuments(mongoFilter);
  } else {
    totalDocs = await this.estimatedDocumentCount();
  }

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
};

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
