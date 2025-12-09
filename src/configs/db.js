const Mongoose = require("mongoose");
const config = require("./envConfig.js");

const connectDB = async () => {
  try {
    await Mongoose.connect(config.mongo);
    console.log(`MongoDB Connection successfully`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
