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

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @throws {AppError} If email format is invalid
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400, 'INVALID_EMAIL');
  }
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @throws {AppError} If password doesn't meet requirements
 */
const validatePasswordStrength = (password) => {
  if (password.length < 6) {
    throw new AppError(
      'Password must be at least 6 characters long',
      400,
      'WEAK_PASSWORD'
    );
  }
};

/**
 * Validate string length
 * @param {String} value - Value to validate
 * @param {String} fieldName - Name of the field
 * @param {Number} minLength - Minimum length
 * @param {Number} maxLength - Maximum length
 * @throws {AppError} If string length is invalid
 */
const validateStringLength = (value, fieldName, minLength, maxLength) => {
  if (typeof value !== 'string') {
    throw new AppError(`${fieldName} must be a string`, 400, 'INVALID_TYPE');
  }

  if (value.length < minLength) {
    throw new AppError(
      `${fieldName} must be at least ${minLength} characters long`,
      400,
      'VALIDATION_ERROR'
    );
  }

  if (value.length > maxLength) {
    throw new AppError(
      `${fieldName} must not exceed ${maxLength} characters`,
      400,
      'VALIDATION_ERROR'
    );
  }
};

/**
 * Validate number range
 * @param {Number} value - Value to validate
 * @param {String} fieldName - Name of the field
 * @param {Number} min - Minimum value
 * @param {Number} max - Maximum value
 * @throws {AppError} If number is out of range
 */
const validateNumberRange = (value, fieldName, min, max) => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AppError(`${fieldName} must be a number`, 400, 'INVALID_TYPE');
  }

  if (value < min || value > max) {
    throw new AppError(
      `${fieldName} must be between ${min} and ${max}`,
      400,
      'VALIDATION_ERROR'
    );
  }
};

/**
 * Validate that value is a positive number
 * @param {Number} value - Value to validate
 * @param {String} fieldName - Name of the field
 * @throws {AppError} If value is not positive
 */
const validatePositiveNumber = (value, fieldName) => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AppError(`${fieldName} must be a number`, 400, 'INVALID_TYPE');
  }

  if (value <= 0) {
    throw new AppError(`${fieldName} must be a positive number`, 400, 'VALIDATION_ERROR');
  }
};

/**
 * Validate that value is a non-negative number
 * @param {Number} value - Value to validate
 * @param {String} fieldName - Name of the field
 * @throws {AppError} If value is negative
 */
const validateNonNegativeNumber = (value, fieldName) => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AppError(`${fieldName} must be a number`, 400, 'INVALID_TYPE');
  }

  if (value < 0) {
    throw new AppError(`${fieldName} cannot be negative`, 400, 'VALIDATION_ERROR');
  }
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {String} dateString - Date string to validate
 * @throws {AppError} If date format is invalid
 */
const validateDateFormat = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw new AppError('Date must be in YYYY-MM-DD format', 400, 'INVALID_DATE_FORMAT');
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new AppError('Invalid date', 400, 'INVALID_DATE');
  }
};

/**
 * Validate that ID is a valid positive integer
 * @param {*} id - ID to validate
 * @param {String} fieldName - Name of the field
 * @throws {AppError} If ID is invalid
 */
const validateId = (id, fieldName = 'ID') => {
  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum <= 0 || String(idNum) !== String(id)) {
    throw new AppError(`${fieldName} must be a positive integer`, 400, 'INVALID_ID');
  }
};

module.exports = {
  validateRequiredFields,
  validateNotEmpty,
  validateResourceExists,
  validateEmail,
  validatePasswordStrength,
  validateStringLength,
  validateNumberRange,
  validatePositiveNumber,
  validateNonNegativeNumber,
  validateDateFormat,
  validateId,
};
