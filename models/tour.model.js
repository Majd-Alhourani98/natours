const mongoose = require('mongoose');
const paginationMetaPlugin = require('./plugins/paginationMeta.plugin');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'Group size is required'],
    },

    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
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
      required: [true, 'Price is required'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: async function (value) {
          // 1. If no discount is provided, it's valid
          if (value === undefined || value === null) return true;

          // 2. Handle Update context (this is a Query)
          if (this instanceof mongoose.Query) {
            const update = this.getUpdate();

            // Find the current document to get the existing price
            const doc = await this.model.findOne(this.getQuery());
            if (!doc) return true;

            // Use the new price if it's being updated, otherwise use the existing price
            const currentPrice = update.$set?.price || update.price || doc.price;

            return value < currentPrice;
          }

          // 3. Handle Create/Save context (this is a Document)
          // 'this' refers to the document being saved
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'Summary is required'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'Cover image is required'],
    },

    images: {
      type: [String],
      default: [],
    },

    startDates: {
      type: [Date],
      default: [],
    },

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

tourSchema.plugin(paginationMetaPlugin);
// Mongoose internally calls: paginationMeta(postSchema);

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
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
