/**
 * Custom AppError class for standardized error handling
 * Extends Error to include status code and additional context
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();

    // Ensure the name of this error is the same as the class name
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
