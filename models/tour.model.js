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
      // maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
    },

    slug: {
      type: String,
      index: true,
      unique: true,
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
      min: [1, 'Duration must be at least 1 day'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
      min: [1, 'Group size must be at least 1 person'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      lowercase: true, // Setter: auto-converts "EASY" to "easy"
      trim: true,
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
      // Setter: Rounds 4.666 to 4.7 automatically before saving
      set: val => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [1, 'Price should be at least 1'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: async function (value) {
          if (this.value) return value < this.price;
        },

        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    summary: {
      type: String,
      trim: true, // only works for strings
      required: [true, 'A tour must have a summary'],
      trim: true,
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

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    // timestamps: true,
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },

    id: false,
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

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
});

// AGGREGATION MIDDLEWARE: Runs for Tour.aggregate()
tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

tourSchema.pre('findOneAndUpdate', async function () {
  const updates = this.getUpdate();
  const query = this.getQuery();

  let price = updates.price;
  let priceDiscount = updates.priceDiscount;

  if (price === undefined && priceDiscount === undefined) {
    return;
  }

  if (!price || !priceDiscount) {
    const doc = await this.model.findOne(query).select('price priceDiscount');

    price = price ?? doc?.price;
    priceDiscount = priceDiscount ?? doc?.priceDiscount;
  }

  if (price <= priceDiscount) {
    throw new Error(`Discount price (${priceDiscount}) should be below regular price (${price})`);
  }

  return;
});

tourSchema.plugin(paginationPlugin);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
