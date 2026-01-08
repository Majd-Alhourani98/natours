const mongoose = require('mongoose');
const pagination = require('../plugins/pagination.plugin');
const { default: slugify } = require('slugify');

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
      unique: true,
    },

    secretTour: {
      type: Boolean,
      default: false,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
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

// plugin
tourSchema.plugin(pagination);

// Virtuals
tourSchema.virtual('durationWeeks').get(function () {
  if (this.duration) return Number((this.duration / 7).toFixed(1));
});

// Pre Save middlewares
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// console.log(this.schema.paths);
// console.log(Object.keys(this.schema.paths));
