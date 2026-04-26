const express = require('express');
const { Player } = require('../database/models');
const { Sequelize } = require('sequelize');
const AppError = require('../utils/AppError');
const { validateResourceExists, validateId } = require('../utils/validation');
const {
  parsePaginationParams,
  formatPaginatedResponse,
  buildSearchFilter,
  parseSortParams,
} = require('../utils/pagination');
const router = express.Router();

/**
 * GET /api/v1/players
 * Retrieve all players with pagination, filtering, and sorting
 * Query params: page, limit, search, sortBy, sortOrder
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const { page, limit, offset } = parsePaginationParams(req.query);

    // Build search filter
    let where = {};
    if (search) {
      where = buildSearchFilter(search, ['name', 'position'], Sequelize);
    }

    // Get count and data
    const { count, rows } = await Player.findAndCountAll({
      where,
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
 * GET /api/v1/players/:id
 * Retrieve a specific player by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    // Validate ID format
    validateId(req.params.id, 'Player ID');

    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

    res.json({
      success: true,
      data: player,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/players
 * Create a new player
 * Required: name, position, number
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, position, number } = req.body;

    // Validate required fields
    if (!name || !position || number === undefined) {
      throw new AppError(
        'Missing required fields: name, position, number',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Validate name is not empty
    if (typeof name !== 'string' || name.trim() === '') {
      throw new AppError('Player name must be a non-empty string', 400, 'VALIDATION_ERROR');
    }

    // Validate position is not empty
    if (typeof position !== 'string' || position.trim() === '') {
      throw new AppError('Position must be a non-empty string', 400, 'VALIDATION_ERROR');
    }

    // Validate number is a valid positive integer
    const playerNumber = parseInt(number, 10);
    if (isNaN(playerNumber) || playerNumber <= 0 || playerNumber > 999) {
      throw new AppError('Player number must be a positive integer between 1 and 999', 400, 'VALIDATION_ERROR');
    }

    const player = await Player.create({
      name: name.trim(),
      position: position.trim(),
      number: playerNumber,
    });

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: player,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/players/:id
 * Update a player
 */
router.put('/:id', async (req, res, next) => {
  try {
    // Validate ID format
    validateId(req.params.id, 'Player ID');

    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

    const { name, position, number } = req.body;

    // Validate fields if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        throw new AppError('Player name must be a non-empty string', 400, 'VALIDATION_ERROR');
      }
    }

    if (position !== undefined) {
      if (typeof position !== 'string' || position.trim() === '') {
        throw new AppError('Position must be a non-empty string', 400, 'VALIDATION_ERROR');
      }
    }

    if (number !== undefined) {
      const playerNumber = parseInt(number, 10);
      if (isNaN(playerNumber) || playerNumber <= 0 || playerNumber > 999) {
        throw new AppError(
          'Player number must be a positive integer between 1 and 999',
          400,
          'VALIDATION_ERROR'
        );
      }
    }

    await player.update(req.body);
    res.json({
      success: true,
      message: 'Player updated successfully',
      data: player,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/players/:id
 * Delete a player
 */
router.delete('/:id', async (req, res, next) => {
  try {
    // Validate ID format
    validateId(req.params.id, 'Player ID');

    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

    await player.destroy();
    res.json({
      success: true,
      message: 'Player deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
