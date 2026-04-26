const express = require('express');
const { PlayerStats, Player, Game } = require('../database/models');
const { Sequelize } = require('sequelize');
const AppError = require('../utils/AppError');
const {
  validateResourceExists,
  validateId,
  validateNonNegativeNumber,
} = require('../utils/validation');
const {
  parsePaginationParams,
  formatPaginatedResponse,
  parseSortParams,
} = require('../utils/pagination');

const router = express.Router();

/**
 * GET /api/v1/stats
 * Retrieve all player statistics with related player and game data
 * Query params: page, limit, sortBy, sortOrder
 */
router.get('/', async (req, res, next) => {
  try {
    const { sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const { page, limit, offset } = parsePaginationParams(req.query);

    const { count, rows } = await PlayerStats.findAndCountAll({
      include: [Player, Game],
      offset,
      limit,
      order: parseSortParams(sortBy, sortOrder),
    });

    res.json(formatPaginatedResponse(rows, count, page, limit));
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
    validateId(req.params.playerId, 'Player ID');

    const player = await Player.findByPk(req.params.playerId);
    if (!player) {
      throw new AppError('Player not found', 404, 'NOT_FOUND');
    }

    const stats = await PlayerStats.findAll({
      where: { playerId: req.params.playerId },
      include: [Player, Game],
      order: [['createdAt', 'DESC']],
    });

    if (stats.length === 0) {
      throw new AppError(
        'No statistics found for this player',
        404,
        'NO_STATS_FOUND'
      );
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
 * GET /api/v1/stats/record/:id
 * Retrieve a specific stat record by ID
 */
router.get('/record/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Stat ID');

    const stat = await PlayerStats.findByPk(req.params.id, {
      include: [Player, Game],
    });

    validateResourceExists(stat, 'Stat record');

    res.json({
      success: true,
      data: stat,
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

    if (playerId === undefined || gameId === undefined) {
      throw new AppError(
        'Missing required fields: playerId, gameId',
        400,
        'VALIDATION_ERROR'
      );
    }

    validateId(playerId, 'Player ID');
    validateId(gameId, 'Game ID');

    const player = await Player.findByPk(playerId);
    if (!player) {
      throw new AppError('Player not found', 404, 'NOT_FOUND');
    }

    const game = await Game.findByPk(gameId);
    if (!game) {
      throw new AppError('Game not found', 404, 'NOT_FOUND');
    }

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
    validateId(req.params.id, 'Stat ID');

    const stat = await PlayerStats.findByPk(req.params.id);
    validateResourceExists(stat, 'Stat record');

    const { playerId, gameId, hits, runs, rbis, strikeouts } = req.body;

    const updateData = {};

    if (playerId !== undefined) {
      validateId(playerId, 'Player ID');

      const player = await Player.findByPk(playerId);
      if (!player) {
        throw new AppError('Player not found', 404, 'NOT_FOUND');
      }

      updateData.playerId = playerId;
    }

    if (gameId !== undefined) {
      validateId(gameId, 'Game ID');

      const game = await Game.findByPk(gameId);
      if (!game) {
        throw new AppError('Game not found', 404, 'NOT_FOUND');
      }

      updateData.gameId = gameId;
    }

    if (hits !== undefined) {
      validateNonNegativeNumber(hits, 'Hits');
      updateData.hits = hits;
    }

    if (runs !== undefined) {
      validateNonNegativeNumber(runs, 'Runs');
      updateData.runs = runs;
    }

    if (rbis !== undefined) {
      validateNonNegativeNumber(rbis, 'RBIs');
      updateData.rbis = rbis;
    }

    if (strikeouts !== undefined) {
      validateNonNegativeNumber(strikeouts, 'Strikeouts');
      updateData.strikeouts = strikeouts;
    }

    await stat.update(updateData);

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