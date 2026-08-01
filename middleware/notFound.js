// middleware/notFound.js
// Catches requests to undefined routes and forwards a 404 to errorHandler.

const notFound = (req, res, next) => {
  const err = new Error(`Route not found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = notFound;
