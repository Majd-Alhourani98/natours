const mongoose = require('mongoose');
const paginationMetaPlugin = require('./plugins/paginationMeta.plugin');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
    },

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
      required: [true, 'Price is required'],
    },

    priceDiscount: {
      type: Number,
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
