/**
 * Pagination and filtering utilities
 */

/**
 * Parse pagination parameters from query
 * @param {Object} query - Request query object
 * @returns {Object} Pagination parameters
 */
const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10)); // Cap at 100
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Format pagination response
 * @param {Array} data - Array of results
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Formatted response
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Build search filter for a field
 * @param {String} searchTerm - Search term
 * @param {Array} searchFields - Fields to search
 * @param {Object} Sequelize - Sequelize instance
 * @returns {Object} Where clause
 */
const buildSearchFilter = (searchTerm, searchFields, Sequelize) => {
  if (!searchTerm || !searchFields || searchFields.length === 0) {
    return {};
  }

  return {
    [Sequelize.Op.or]: searchFields.map((field) => ({
      [field]: { [Sequelize.Op.like]: `%${searchTerm}%` },
    })),
  };
};

/**
 * Parse sort parameters
 * @param {String} sortBy - Sort field (e.g., "createdAt")
 * @param {String} sortOrder - Sort order ("ASC" or "DESC")
 * @returns {Array} Sort array for Sequelize
 */
const parseSortParams = (sortBy = 'createdAt', sortOrder = 'DESC') => {
  const validOrders = ['ASC', 'DESC'];
  const order = validOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';
  return [[sortBy, order]];
};

module.exports = {
  parsePaginationParams,
  formatPaginatedResponse,
  buildSearchFilter,
  parseSortParams,
};
