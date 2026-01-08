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
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,

      validate: async function (value) {
        if (!value) return true;

        // this: .save and .create() refers to the document
        // this: update refers to query

        if (this instanceof mongoose.Query) {
          const query = this.getQuery();
          const update = this.getUpdate();

          const doc = await this.model.findOne(query);

          if (!doc) return true;

          const newPrice = update.$set?.price ?? doc.price;
          return value < newPrice;
        }

        return value < this.price;
      },

      message: 'Discount price should be below regular price',
    },

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
    id: false,
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

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// console.log(this.schema.paths);
// console.log(Object.keys(this.schema.paths));
