const express = require('express');
const { Game } = require('../database/models');
const { Sequelize } = require('sequelize');
const AppError = require('../utils/AppError');
const {
  validateResourceExists,
  validateId,
  validateDateFormat,
} = require('../utils/validation');
const {
  parsePaginationParams,
  formatPaginatedResponse,
  buildSearchFilter,
  parseSortParams,
} = require('../utils/pagination');

const router = express.Router();

/**
 * GET /api/v1/games
 * Retrieve all games with pagination, filtering, and sorting
 * Query params: page, limit, search, sortBy, sortOrder
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, sortBy = 'date', sortOrder = 'DESC' } = req.query;
    const { page, limit, offset } = parsePaginationParams(req.query);

    let where = {};

    if (search) {
      where = buildSearchFilter(search, ['opponent', 'location', 'score'], Sequelize);
    }

    const { count, rows } = await Game.findAndCountAll({
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
 * GET /api/v1/games/:id
 * Retrieve a specific game by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Game ID');

    const game = await Game.findByPk(req.params.id);
    validateResourceExists(game, 'Game');

    res.json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/v1/games
 * Create a new game
 * Required: opponent, date, location
 */
router.post('/', async (req, res, next) => {
  try {
    const { opponent, date, location, score } = req.body;

    if (!opponent || !date || !location) {
      throw new AppError(
        'Missing required fields: opponent, date, location',
        400,
        'VALIDATION_ERROR'
      );
    }

    if (typeof opponent !== 'string' || opponent.trim() === '') {
      throw new AppError(
        'Opponent must be a non-empty string',
        400,
        'VALIDATION_ERROR'
      );
    }

    if (typeof location !== 'string' || location.trim() === '') {
      throw new AppError(
        'Location must be a non-empty string',
        400,
        'VALIDATION_ERROR'
      );
    }

    validateDateFormat(date);

    if (score !== undefined && score !== null) {
      if (typeof score !== 'string' || score.trim() === '') {
        throw new AppError(
          'Score must be a non-empty string',
          400,
          'VALIDATION_ERROR'
        );
      }
    }

    const game = await Game.create({
      opponent: opponent.trim(),
      date,
      location: location.trim(),
      score: score ? score.trim() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/v1/games/:id
 * Update a game
 */
router.put('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Game ID');

    const game = await Game.findByPk(req.params.id);
    validateResourceExists(game, 'Game');

    const { opponent, date, location, score } = req.body;

    const updateData = {};

    if (opponent !== undefined) {
      if (typeof opponent !== 'string' || opponent.trim() === '') {
        throw new AppError(
          'Opponent must be a non-empty string',
          400,
          'VALIDATION_ERROR'
        );
      }

      updateData.opponent = opponent.trim();
    }

    if (date !== undefined) {
      validateDateFormat(date);
      updateData.date = date;
    }

    if (location !== undefined) {
      if (typeof location !== 'string' || location.trim() === '') {
        throw new AppError(
          'Location must be a non-empty string',
          400,
          'VALIDATION_ERROR'
        );
      }

      updateData.location = location.trim();
    }

    if (score !== undefined) {
      if (score === null || score === '') {
        updateData.score = null;
      } else {
        if (typeof score !== 'string' || score.trim() === '') {
          throw new AppError(
            'Score must be a non-empty string',
            400,
            'VALIDATION_ERROR'
          );
        }

        updateData.score = score.trim();
      }
    }

    await game.update(updateData);

    res.json({
      success: true,
      message: 'Game updated successfully',
      data: game,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/v1/games/:id
 * Delete a game
 */
router.delete('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Game ID');

    const game = await Game.findByPk(req.params.id);
    validateResourceExists(game, 'Game');

    await game.destroy();

    res.json({
      success: true,
      message: 'Game deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;