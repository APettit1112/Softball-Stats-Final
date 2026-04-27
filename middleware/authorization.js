const AppError = require('../utils/AppError');

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
 * Role check middleware
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED'));
    }

    const rolesArray = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    if (!rolesArray.includes(req.user.role)) {
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
 * Ownership check (user can only access own data unless admin)
 */
const requireOwnership = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED'));
  }

  // admin override
  if (req.user.role === 'admin') return next();

  const resourceUserId =
    req.params.userId || req.body.userId || req.query.userId;

  if (!resourceUserId) {
    return next(new AppError('Missing resource ownership info', 400, 'NO_RESOURCE_ID'));
  }

  if (parseInt(resourceUserId) !== req.user.id) {
    return next(
      new AppError('You can only access your own resources', 403, 'NOT_OWNER')
    );
  }

  next();
};

/**
 * Permission-based middleware
 */
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401, 'NOT_AUTHENTICATED'));
    }

    const permissions = ROLE_PERMISSIONS[req.user.role] || {};

    if (!permissions[permission]) {
      return next(
        new AppError('Permission denied', 403, 'PERMISSION_DENIED')
      );
    }

    next();
  };
};

/**
 * Attach role context
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