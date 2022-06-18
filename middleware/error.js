const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  if (process.env.NODE_ENV !== "test") {
    // Log to console for dev
    console.log(err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = err.message;
    message = message.split(":");
    message = message[2] + " :" + message[4];
    message = message.replace(/[&\/\\#,+()$~%.'"*?<>{}]/g, "");
    message = message.replace("E11000", "");
    message = message.split(":");
    let field = message[0].split(" ");
    field = field[1];
    field = field.replace(/[^A-Za-z]+/g, "");
    message = `object already exists with ${field} : ${message[1]}`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
