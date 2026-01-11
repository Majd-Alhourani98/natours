const mongoose = require("mongoose");
const slugify = require("slugify");

const getPaginationMetaData = require("./plugins/getPaginationMetaData");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },

    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
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
      required: [true, "A tour must have a price"],
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true, // only works for strings
      required: [true, "A tour must have a summary"],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.index({ name: "text", description: "text", summary: "text" });

tourSchema.plugin(getPaginationMetaData);

tourSchema
  .virtual(
    "durationInWefeat(models): add query middleware to filter out secret tourseks",
  )
  .get(function () {
    if (this.duration) return Number((this.duration / 7).toFixed(1));
  });

tourSchema.pre("save", function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
});

tourSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
