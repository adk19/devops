const ApiError = require("../utils/ApiErrors.js");

const errorHandler = (err, req, res) => {
  // Check if the error is an instance of ApiError
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode || 500)
      .json({ status: false, message: err?.message });
  }

  return res.status(500).json({
    status: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
