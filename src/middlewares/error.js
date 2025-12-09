const ApiError = require("../utils/ApiErrors.js");

const errorHandler = (err, req, res) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ApiError(404, message);
  }

  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ApiError(400, message);
  }

  if (err.name === "validationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, message);
  }

  if (!res || typeof res.status !== "function") {
    console.log("Invalid response object in error handler");
    return;
  }

  res
    .status(error?.statusCode || 500)
    .json({ success: false, message: error?.message || "Server Error" });
};

module.exports = errorHandler;
