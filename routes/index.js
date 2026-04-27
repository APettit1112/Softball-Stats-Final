const express = require('express');
const usersRoutes = require('./users');
const playersRoutes = require('./players');
const gamesRoutes = require('./games');
const statsRoutes = require('./stats');
const authRoutes = require('./auth');

const { verifyToken } = require('../middleware/auth');
const { attachUserContext } = require('../middleware/authorization');

const router = express.Router();

/**
 * PUBLIC
 */
router.use('/auth', authRoutes);

/**
 * PROTECTED
 */
router.use(verifyToken);
router.use(attachUserContext);

router.use('/users', usersRoutes);
router.use('/players', playersRoutes);
router.use('/games', gamesRoutes);
router.use('/stats', statsRoutes);

module.exports = router;