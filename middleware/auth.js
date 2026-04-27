// middleware/auth.js

const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Production safety: Warn if using default JWT secret
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === 'production') {
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Using insecure default.');
  console.warn('⚠️  For production, set JWT_SECRET environment variable.');
}

const finalJwtSecret = jwtSecret || 'your-secret-key-change-in-production';

/**
 * Verify JWT token middleware
 * Validates the token and attaches user info to req.user
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError('No token provided', 401, 'NO_TOKEN'));
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next(new AppError('Invalid token format', 401, 'INVALID_TOKEN_FORMAT'));
    }

    const token = parts[1];

    const decoded = jwt.verify(token, finalJwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
    }
    next(error);
  }
};

module.exports = { verifyToken };