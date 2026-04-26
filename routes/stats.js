const express = require('express');
const { PlayerStats, Player, Game } = require('../database/models');
const AppError = require('../utils/AppError');
const { validateResourceExists } = require('../utils/validation');
const router = express.Router();

/**
 * GET /api/v1/stats
 * Retrieve all player statistics with related player and game data
 */
router.get('/', async (req, res, next) => {
  try {
    const stats = await PlayerStats.findAll({
      include: [Player, Game],
    });
    res.json({
      success: true,
      data: stats,
      count: stats.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/stats/:playerId
 * Retrieve statistics for a specific player
 */
router.get('/:playerId', async (req, res, next) => {
  try {
    const stats = await PlayerStats.findAll({
      where: { playerId: req.params.playerId },
      include: [Player, Game],
    });

    if (stats.length === 0) {
      throw new AppError('No statistics found for this player', 404, 'NO_STATS_FOUND');
    }

    res.json({
      success: true,
      data: stats,
      count: stats.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/stats
 * Create a new stat record
 */
router.post('/', async (req, res, next) => {
  try {
    const stat = await PlayerStats.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Stat record created successfully',
      data: stat,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/stats/:id
 * Update a stat record
 */
router.put('/:id', async (req, res, next) => {
  try {
    const stat = await PlayerStats.findByPk(req.params.id);
    validateResourceExists(stat, 'Stat record');

    await stat.update(req.body);
    res.json({
      success: true,
      message: 'Stat record updated successfully',
      data: stat,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/stats/:id
 * Delete a stat record
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const stat = await PlayerStats.findByPk(req.params.id);
    validateResourceExists(stat, 'Stat record');

    await stat.destroy();
    res.json({
      success: true,
      message: 'Stat record deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
