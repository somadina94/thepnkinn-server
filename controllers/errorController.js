const AppError = require("../util/appError");

const handleDuplicateFieldDB = (err) => {
  const [key] = Object.keys(err.keyValue);
  const [value] = Object.values(err.keyValue);
  const message = `A user with ${key}:${value} already exist`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => new AppError(err.message, 400);

const handleJsonWebTokenError = (err) =>
  new AppError("Invalid token! Please login again.", 401);

const handleJwtTokenExpiredError = (err) =>
  new AppError("Session timeout, please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.errorResponse?.code === 11000)
      error = handleDuplicateFieldDB(error);
    if (error.name === "JsonWebTokenError")
      error = handleJsonWebTokenError(error);
    if (error.name === "TokenExpiredError")
      error = handleJwtTokenExpiredError(error);

    sendErrorProd(error, res);
  }
};
