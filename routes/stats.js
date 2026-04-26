const express = require('express');
const { PlayerStats, Player, Game } = require('../database/models');
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
    res.json(stats);
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
    res.json(stats);
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
    res.status(201).json(stat);
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
    if (!stat) {
      return res.status(404).json({ error: 'Stat record not found' });
    }
    await stat.update(req.body);
    res.json(stat);
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
    if (!stat) {
      return res.status(404).json({ error: 'Stat record not found' });
    }
    await stat.destroy();
    res.json({ message: 'Stat record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
