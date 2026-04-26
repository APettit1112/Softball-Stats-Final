const AppError = require('./AppError');

/**
 * Validation helper functions
 */

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 * @throws {AppError} If any required field is missing
 */
const validateRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'VALIDATION_ERROR'
    );
  }
};

/**
 * Validate that a value is not empty
 * @param {*} value - Value to validate
 * @param {String} fieldName - Name of the field being validated
 * @throws {AppError} If value is empty
 */
const validateNotEmpty = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new AppError(`${fieldName} cannot be empty`, 400, 'VALIDATION_ERROR');
  }
};

/**
 * Validate that a resource exists
 * @param {*} resource - Resource to validate
 * @param {String} resourceType - Type of resource (e.g., 'Player', 'Game')
 * @throws {AppError} If resource is null or undefined
 */
const validateResourceExists = (resource, resourceType) => {
  if (!resource) {
    throw new AppError(`${resourceType} not found`, 404, 'NOT_FOUND');
  }
};

module.exports = {
  validateRequiredFields,
  validateNotEmpty,
  validateResourceExists,
};
