// routes/index.js

const express = require('express');

const usersRoutes = require('./users');
const playersRoutes = require('./players');
const gamesRoutes = require('./games');
const statsRoutes = require('./stats');
const authRoutes = require('./auth'); // make sure this file exists in /routes

const { verifyToken } = require('../middleware/auth');
const { attachUserContext } = require('../middleware/authorization');

const router = express.Router();

/**
 * ==========================
 * PUBLIC ROUTES
 * ==========================
 */
router.use('/auth', authRoutes);

/**
 * ==========================
 * PROTECTED ROUTES
 * ==========================
 */
router.use(verifyToken);
router.use(attachUserContext);

router.use('/users', usersRoutes);
router.use('/players', playersRoutes);
router.use('/games', gamesRoutes);
router.use('/stats', statsRoutes);

module.exports = router;