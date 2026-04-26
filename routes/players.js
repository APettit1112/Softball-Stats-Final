const express = require('express');
const { Player } = require('../database/models');
const AppError = require('../utils/AppError');
const { validateResourceExists } = require('../utils/validation');
const router = express.Router();

/**
 * GET /api/v1/players
 * Retrieve all players
 */
router.get('/', async (req, res, next) => {
  try {
    const players = await Player.findAll();
    res.json({
      success: true,
      data: players,
      count: players.length,
    });
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
 */
router.post('/', async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
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
    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

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
