const AppError = require('../utils/AppError');

/**
 * Role-Based Access Control (RBAC) Middleware
 * Defines permissions for different user roles
 */

// Define role permissions
const ROLE_PERMISSIONS = {
  admin: {
    canViewAllUsers: true,
    canDeleteUsers: true,
    canManageAllTasks: true,
    canViewAllRecords: true,
    canDeleteAnyRecord: true,
    canManageRoles: true,
  },
  user: {
    canViewAllUsers: false,
    canDeleteUsers: false,
    canManageAllTasks: false,
    canViewAllRecords: false,
    canDeleteAnyRecord: false,
    canManageRoles: false,
  },
};

/**
 * Middleware to check if user has a specific role
 * @param {String|Array} requiredRole - Role(s) required to access the route
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED'));
    }

    const userRole = req.user.role;
    const rolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!rolesArray.includes(userRole)) {
      return next(
        new AppError(
          `Access denied. Required role(s): ${rolesArray.join(', ')}`,
          403,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
};

/**
 * Middleware to check if user owns a resource
 * @param {String} resourceUserId - The ID of the user who owns the resource
 */
const requireOwnership = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED'));
  }

  // Allow if user is admin
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if user owns the resource
  const resourceUserId = req.params.userId || req.body.userId;
  if (parseInt(resourceUserId) !== req.user.id) {
    return next(
      new AppError('You can only manage your own records', 403, 'NOT_RESOURCE_OWNER')
    );
  }

  next();
};

/**
 * Check if user has specific permission
 * @param {String} permission - Permission key
 */
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED'));
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || {};
    if (!userPermissions[permission]) {
      return next(
        new AppError('You do not have permission to perform this action', 403, 'PERMISSION_DENIED')
      );
    }

    next();
  };
};

/**
 * Attach role and permissions to request for easier access in routes
 */
const attachUserContext = (req, res, next) => {
  if (req.user) {
    req.user.permissions = ROLE_PERMISSIONS[req.user.role] || {};
    req.user.isAdmin = req.user.role === 'admin';
  }
  next();
};

module.exports = {
  requireRole,
  requireOwnership,
  hasPermission,
  attachUserContext,
  ROLE_PERMISSIONS,
};
