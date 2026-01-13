const mongoose = require('mongoose');
const paginationPlugin = require('./plugins/pagination.plugin');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      index: true,
      unique: true,
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
    // timestamps: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index(
  { name: 'text', description: 'text' },
  {
    weights: {
      name: 10, // highest priority
      description: 5, // lowest priority
    },
    name: 'TourTextSearchIndex', // custom index name
  }
);

tourSchema.virtual('durationInWeeks').get(function () {
  if (this.duration) return +(this.duration / 7).toFixed(2);
});

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.plugin(paginationPlugin);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
