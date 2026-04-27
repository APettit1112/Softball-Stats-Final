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
 * REGISTER
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    validateRequiredFields(req.body, ['username', 'email', 'password']);
    validateNotEmpty(username);
    validateEmail(email);
    validatePasswordStrength(password);

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new AppError('Email already exists', 409);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      role: 'user',
    });

    res.status(201).json({
      success: true,
      message: 'User registered',
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;