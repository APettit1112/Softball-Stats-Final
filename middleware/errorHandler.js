/**
 * Global error handler middleware
 * Catches and formats all errors from the application
 */
module.exports = (err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    status: err.statusCode || 500,
    code: err.code || 'INTERNAL_ERROR',
    timestamp: err.timestamp || new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  // Don't send headers if already sent
  if (res.headersSent) {
    return next(err);
  }

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;
  let errorCode = err.code || 'INTERNAL_ERROR';
  let message = err.message || 'Internal server error';
  let details = null;

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation error';
    details = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    errorCode = 'DUPLICATE_ENTRY';
    message = 'Duplicate entry';
    details = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} already exists`,
    }));
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    errorCode = 'INVALID_JSON';
    message = 'Invalid JSON in request body';
  }

  // Build error response
  const response = {
    success: false,
    error: {
      code: errorCode,
      message: message,
      timestamp: new Date().toISOString(),
    },
  };

  // Add details if available
  if (details) {
    response.error.details = details;
  }

  // Add path and method for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    response.error.path = req.path;
    response.error.method = req.method;
  }

  res.status(statusCode).json(response);
};
