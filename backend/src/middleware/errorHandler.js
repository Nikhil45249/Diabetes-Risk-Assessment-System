/**
 * Centralized error-handling middleware.
 * Never exposes stack traces or internal details to the client.
 */

function notFoundHandler(_req, _res, next) {
  const err = new Error("Route not found");
  err.statusCode = 404;
  next(err);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500
      ? "Internal server error"
      : err.message || "Something went wrong";

  // Log full error server-side
  console.error(`[ERROR ${statusCode}]`, err.message);
  if (statusCode === 500) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: { message, statusCode },
  });
}

module.exports = { errorHandler, notFoundHandler };
