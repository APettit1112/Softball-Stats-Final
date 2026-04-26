const express = require('express');
const { Game } = require('../database/models');
const AppError = require('../utils/AppError');
const { validateResourceExists, validateId, validateDateFormat } = require('../utils/validation');
const router = express.Router();

/**
 * GET /api/v1/games
 * Retrieve all games
 */
router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll();
    res.json({
      success: true,
      data: games,
      count: games.length,
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

    // Validate required fields
    if (!opponent || !date || !location) {
      throw new AppError(
        'Missing required fields: opponent, date, location',
        400,
        'VALIDATION_ERROR'
      );
    }

    // Validate opponent is not empty
    if (typeof opponent !== 'string' || opponent.trim() === '') {
      throw new AppError('Opponent must be a non-empty string', 400, 'VALIDATION_ERROR');
    }

    // Validate location is not empty
    if (typeof location !== 'string' || location.trim() === '') {
      throw new AppError('Location must be a non-empty string', 400, 'VALIDATION_ERROR');
    }

    // Validate date format
    validateDateFormat(date);

    // Validate score format if provided
    if (score !== undefined && score !== null) {
      if (typeof score !== 'string' || score.trim() === '') {
        throw new AppError('Score must be a non-empty string', 400, 'VALIDATION_ERROR');
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
    // Validate ID format
    validateId(req.params.id, 'Game ID');

    const game = await Game.findByPk(req.params.id);
    validateResourceExists(game, 'Game');

    const { opponent, date, location, score } = req.body;

    // Validate fields if provided
    if (opponent !== undefined) {
      if (typeof opponent !== 'string' || opponent.trim() === '') {
        throw new AppError('Opponent must be a non-empty string', 400, 'VALIDATION_ERROR');
      }
    }

    if (date !== undefined) {
      validateDateFormat(date);
    }

    if (location !== undefined) {
      if (typeof location !== 'string' || location.trim() === '') {
        throw new AppError('Location must be a non-empty string', 400, 'VALIDATION_ERROR');
      }
    }

    if (score !== undefined && score !== null) {
      if (typeof score !== 'string' || score.trim() === '') {
        throw new AppError('Score must be a non-empty string', 400, 'VALIDATION_ERROR');
      }
    }

    await game.update(req.body);
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
    // Validate ID format
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
