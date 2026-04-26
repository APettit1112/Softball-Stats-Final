/**
 * Central route configuration
 * Organizes all API routes by feature and protection level
 */
const express = require('express');
const usersRoutes = require('./users');
const playersRoutes = require('./players');
const gamesRoutes = require('./games');
const statsRoutes = require('./stats');
const { verifyToken } = require('../middleware/auth');
const { attachUserContext } = require('../middleware/authorization');

const router = express.Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Auth routes - user registration and login
router.use('/auth', usersRoutes);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Apply verifyToken middleware to all routes below
router.use(verifyToken);

// Attach user context (permissions, role info)
router.use(attachUserContext);

// User management routes
router.use('/users', usersRoutes);

// Resource management routes
router.use('/players', playersRoutes);
router.use('/games', gamesRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
