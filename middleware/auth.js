// routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../database/models');
const AppError = require('../utils/AppError');

const {
  validateRequiredFields,
  validateNotEmpty,
  validateEmail,
  validatePasswordStrength,
} = require('../utils/validation');

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

/**
 * POST /api/v1/auth/register
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

    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new AppError(
        'Email already exists',
        409,
        'DUPLICATE_EMAIL'
      );
    }

    const existingUsername = await User.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new AppError(
        'Username already exists',
        409,
        'DUPLICATE_USERNAME'
      );
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
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    validateRequiredFields(req.body, ['email', 'password']);

    validateNotEmpty(email, 'Email');
    validateNotEmpty(password, 'Password');

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        'Invalid credentials',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new AppError(
        'Invalid credentials',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
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
 * POST /api/v1/auth/logout
 * JWT logout is handled client-side
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Remove token on client side.',
  });
});

module.exports = router;