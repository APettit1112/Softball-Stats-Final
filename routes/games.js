const express = require('express');
const { Game } = require('../database/models');
const AppError = require('../utils/AppError');
const { validateResourceExists } = require('../utils/validation');
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
 */
router.post('/', async (req, res, next) => {
  try {
    const game = await Game.create(req.body);
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
    const game = await Game.findByPk(req.params.id);
    validateResourceExists(game, 'Game');

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
