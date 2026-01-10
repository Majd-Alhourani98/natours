const slugify = require('slugify');
const mongoose = require('mongoose');

const paginationPlugin = require('./plugins/paginationPlugin');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },

    slug: String,

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

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a compound text index on the 'name' and 'description' fields.
// This enables full-text search capabilities, allowing for more complex
// queries than standard string matching.
tourSchema.index({
  name: 'text',
  description: 'text',
});

// Apply it to the tourSchema
tourSchema.plugin(paginationPlugin);

tourSchema.virtual('durationInWeeks').get(function () {
  if (this.duration) return Number((this.duration / 7).toFixed(1));
});

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
});

tourSchema.pre('aggregate', function () {
  const pipeline = this.pipeline();

  // Only unshift if the first stage isn't $geoNear
  if (!(Object.keys(pipeline[0])[0] === '$geoNear')) {
    pipeline.unshift({ $match: { secretTour: { $ne: true } } });
  }

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
