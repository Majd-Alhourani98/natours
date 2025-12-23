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
  }
);

tourSchema.plugin(paginationMetaPlugin);
// Mongoose internally calls: paginationMeta(postSchema);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// Mental Model (Very Important)
// Plugin = schema extender: Plugin function → receives schema → attaches things to schema

// “A Mongoose plugin always receives the schema because its job is to extend it. The methods added by the plugin receive only their own arguments and use this to access the model.”
