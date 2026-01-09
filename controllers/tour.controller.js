const Tour = require("../models/tour.model");
const APIFeatures = require("../utils/apiFeatures");

const getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .search()
      .sort()
      .select()
      .paginate();

    const { page = 1, limit = 12 } = features.paginationData;

    const [tours, paginationMetaData] = await Promise.all([
      features.query,
      Tour.getPaginationMetaData(features.mongoFilter, page, limit),
    ]);

    return res.status(200).json({
      status: "success",
      results: tours.length,
      message: "Tours retrieved successfully",
      paginationMetaData,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const data = req.body;
    const tour = await Tour.create(data);

    return res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Tour retrieved successfully",
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      data: { tour },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "No tour found with that ID",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const aliasTopFiveTour = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                numTours: { $sum: 1 },
                numOfRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                minRating: { $min: "$ratingsAverage" },
                maxRating: { $max: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
              },
            },

            {
              $project: { _id: 0 },
            },
          ],

          byDifficulty: [
            {
              // 1) Filter for tours with a high enough rating
              $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
              // 2) Group by difficulty (converted to uppercase)
              $group: {
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numOfRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                minRating: { $min: "$ratingsAverage" },
                maxRating: { $max: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
              },
            },
            {
              // 3) Sort by average price (ascending)
              $sort: { avgPrice: 1 },
            },
            {
              // 4) Filter out 'EASY' (Note: must be uppercase to match group stage)
              $match: { _id: { $ne: "EASY" } },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      message: "Statistics retrieved successfully",
      data: { stats: stats[0] },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);

    const plan = await Tour.aggregate([
      {
        // 1) Deconstruct the startDates array
        $unwind: "$startDates",
      },
      {
        // 2) Filter by the requested year
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        // 3) Group by month
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" }, // Collect tour names for each month
        },
      },
      {
        // 4) Add a readable month field
        $addFields: { month: "$_id" },
      },
      {
        // 5) Hide the internal _id field
        $project: { _id: 0 },
      },
      {
        // 6) Sort by busiest month first
        $sort: { numTourStarts: -1 },
      },
      {
        // 7) Limit results (optional, but good for safety)
        $limit: 12,
      },
    ]);

    return res.status(200).json({
      status: "success",
      message: "Monthly plan retrieved successfully",
      results: plan.length,
      data: { plan },
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopFiveTour,
  getTourStats,
  getMonthlyPlan,
};
