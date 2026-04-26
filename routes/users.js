const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const { Sequelize } = require('sequelize');
const AppError = require('../utils/AppError');
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
    const { username, email, password } = req.body;

    validateRequiredFields(req.body, ['username', 'email', 'password']);
    validateNotEmpty(username, 'Username');
    validateNotEmpty(email, 'Email');
    validateNotEmpty(password, 'Password');

    validateEmail(email);
    validatePasswordStrength(password);

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      throw new AppError('Username already taken', 409, 'DUPLICATE_USERNAME');
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new AppError('Email already registered', 409, 'DUPLICATE_EMAIL');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
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

    validateRequiredFields(req.body, ['username', 'password']);
    validateNotEmpty(username, 'Username');
    validateNotEmpty(password, 'Password');

    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new AppError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new AppError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
    }

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
 */
router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

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
      offset: Number(offset),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/users/:id
 * Get user by ID (owner or admin only)
 */
router.get('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'User ID');

    const userId = Number(req.params.id);

    const isOwner = req.user.id === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError(
        'You can only view your own profile',
        403,
        'FORBIDDEN'
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
 * Update user (owner or admin only)
 */
router.put('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'User ID');

    const userId = Number(req.params.id);

    const isOwner = req.user.id === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError(
        'You can only update your own profile',
        403,
        'FORBIDDEN'
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    const { email, password, role } = req.body;

    if (email) {
      validateEmail(email);

      const existingEmail = await User.findOne({
        where: {
          email,
          id: { [Sequelize.Op.ne]: userId },
        },
      });

      if (existingEmail) {
        throw new AppError('Email already in use', 409, 'DUPLICATE_EMAIL');
      }

      user.email = email;
    }

    if (password) {
      validatePasswordStrength(password);
      user.password = await bcrypt.hash(password, 10);
    }

    if (role) {
      if (!isAdmin) {
        throw new AppError(
          'Only admins can change roles',
          403,
          'FORBIDDEN'
        );
      }

      user.role = role;
    }

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

    const userId = Number(req.params.id);

    if (userId === req.user.id) {
      throw new AppError(
        'You cannot delete your own account',
        400,
        'SELF_DELETE_FORBIDDEN'
      );
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