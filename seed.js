const fs = require("fs");
const path = require("path");

const Tour = require("./models/tour.model");
const connectDB = require("./config/db");

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "tours-simple.json"), "utf-8"),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("✅ Data successfully loaded!");
    process.exit();
  } catch (error) {
    console.log("❌", error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("✅ Data successfully deleted");
    process.exit();
  } catch (error) {
    console.log("❌", error);
  }
};

const run = async () => {
  await connectDB();

  const command = process.argv[2].toLowerCase();

  // Execute based on the passed command
  if (command === "--import" || command === "-i") {
    importData();
  } else if (command === "--delete" || command == "-d") {
    deleteData();
  }
};

run();
