const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');
const AppError = require('../utils/AppError');
const { validateRequiredFields, validateNotEmpty } = require('../utils/validation');
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

    // Check if user already exists
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      throw new AppError('Username already taken', 409, 'DUPLICATE_USERNAME');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
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

module.exports = router;
