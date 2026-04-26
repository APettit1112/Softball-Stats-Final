const express = require('express');
const { PlayerStats, Player, Game } = require('../database/models');
const AppError = require('../utils/AppError');
const {
  validateResourceExists,
  validateId,
  validateNonNegativeNumber,
} = require('../utils/validation');
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
    // Validate player ID format
    validateId(req.params.playerId, 'Player ID');

    // Check if player exists
    const player = await Player.findByPk(req.params.playerId);
    if (!player) {
      throw new AppError('Player not found', 404, 'NOT_FOUND');
    }

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
 * Required: playerId, gameId
 */
router.post('/', async (req, res, next) => {
  try {
    const { playerId, gameId, hits, runs, rbis, strikeouts } = req.body;

    // Validate required fields
    if (playerId === undefined || gameId === undefined) {
      throw new AppError(
        'Missing required fields: playerId, gameId',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Validate IDs
    validateId(playerId, 'Player ID');
    validateId(gameId, 'Game ID');

    // Check if player exists
    const player = await Player.findByPk(playerId);
    if (!player) {
      throw new AppError('Player not found', 404, 'NOT_FOUND');
    }

    // Check if game exists
    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new AppError('Game not found', 404, 'NOT_FOUND');
    }

    // Validate numeric fields if provided
    if (hits !== undefined && hits !== null) {
      validateNonNegativeNumber(hits, 'Hits');
    }

    if (runs !== undefined && runs !== null) {
      validateNonNegativeNumber(runs, 'Runs');
    }

    if (rbis !== undefined && rbis !== null) {
      validateNonNegativeNumber(rbis, 'RBIs');
    }

    if (strikeouts !== undefined && strikeouts !== null) {
      validateNonNegativeNumber(strikeouts, 'Strikeouts');
    }

    const stat = await PlayerStats.create({
      playerId,
      gameId,
      hits: hits || 0,
      runs: runs || 0,
      rbis: rbis || 0,
      strikeouts: strikeouts || 0,
    });

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
    // Validate stat ID format
    validateId(req.params.id, 'Stat ID');

    const stat = await PlayerStats.findByPk(req.params.id);
    validateResourceExists(stat, 'Stat record');

    const { playerId, gameId, hits, runs, rbis, strikeouts } = req.body;

    // Validate IDs if provided
    if (playerId !== undefined) {
      validateId(playerId, 'Player ID');
      const player = await Player.findByPk(playerId);
      if (!player) {
        throw new AppError('Player not found', 404, 'NOT_FOUND');
      }
    }

    if (gameId !== undefined) {
      validateId(gameId, 'Game ID');
      const game = await Game.findByPk(gameId);
      if (!game) {
        throw new AppError('Game not found', 404, 'NOT_FOUND');
      }
    }

    // Validate numeric fields if provided
    if (hits !== undefined && hits !== null) {
      validateNonNegativeNumber(hits, 'Hits');
    }

    if (runs !== undefined && runs !== null) {
      validateNonNegativeNumber(runs, 'Runs');
    }

    if (rbis !== undefined && rbis !== null) {
      validateNonNegativeNumber(rbis, 'RBIs');
    }

    if (strikeouts !== undefined && strikeouts !== null) {
      validateNonNegativeNumber(strikeouts, 'Strikeouts');
    }

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
    // Validate stat ID format
    validateId(req.params.id, 'Stat ID');

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
