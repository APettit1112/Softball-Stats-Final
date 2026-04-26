const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const AppError = require('../utils/AppError');
const { Sequelize } = require('sequelize');
const {
  validateRequiredFields,
  validateNotEmpty,
  validateEmail,
  validatePasswordStrength,
  validateId,
} = require('../utils/validation');
const { requireRole } = require('../middleware/authorization');
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    validateRequiredFields(req.body, ['username', 'email', 'password']);
    validateNotEmpty(username, 'Username');
    validateNotEmpty(email, 'Email');
    validateNotEmpty(password, 'Password');

    // Validate email format
    validateEmail(email);

    // Validate password strength
    validatePasswordStrength(password);

    // Check if user already exists (by username)
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw new AppError('Username already taken', 409, 'DUPLICATE_USERNAME');
    }

    // Check if user already exists (by email)
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new AppError('Email already registered', 409, 'DUPLICATE_EMAIL');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user', // Default to 'user' role on registration
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    validateRequiredFields(req.body, ['username', 'password']);
    validateNotEmpty(username, 'Username');
    validateNotEmpty(password, 'Password');

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new AppError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/users
 * Get all users (admin only)
 * Optional query params: page, limit, search
 */
router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = {};
    if (search) {
      where = {
        [Sequelize.Op.or]: [
          { username: { [Sequelize.Op.like]: `%${search}%` } },
          { email: { [Sequelize.Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/users/:id
 * Get user by ID
 * Users can only view their own profile, admins can view anyone
 */
router.get('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'User ID');

    const userId = parseInt(req.params.id);
    const isOwner = req.user.id === userId;
    const isAdmin = req.user.role === 'admin';

    // Check authorization
    if (!isOwner && !isAdmin) {
      throw new AppError(
        'You can only view your own profile',
        403,
        'NOT_RESOURCE_OWNER'
      );
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/users/:id
 * Update user
 * Users can update their own profile (except role), admins can update anyone
 */
router.put('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'User ID');

    const userId = parseInt(req.params.id);
    const isOwner = req.user.id === userId;
    const isAdmin = req.user.role === 'admin';

    // Check authorization
    if (!isOwner && !isAdmin) {
      throw new AppError(
        'You can only update your own profile',
        403,
        'NOT_RESOURCE_OWNER'
      );
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const { email, password, role } = req.body;

    // Validate email if provided
    if (email) {
      validateEmail(email);
      const existingEmail = await User.findOne({
        where: { email, id: { [Sequelize.Op.ne]: userId } },
      });
      if (existingEmail) {
        throw new AppError('Email already in use', 409, 'DUPLICATE_EMAIL');
      }
    }

    // Validate password if provided
    if (password) {
      validatePasswordStrength(password);
      user.password = await bcrypt.hash(password, 10);
    }

    // Only admins can change roles
    if (role && !isAdmin) {
      throw new AppError('Only admins can change user roles', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    // Update allowed fields
    if (email) user.email = email;
    if (role && isAdmin) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/users/:id
 * Delete user (admin only)
 */
router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    validateId(req.params.id, 'User ID');

    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      throw new AppError('You cannot delete your own account', 400, 'CANNOT_DELETE_SELF');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: { id: userId },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
