const express = require('express');
const { Player } = require('../database/models');
const router = express.Router();

/**
 * GET /api/v1/players
 * Retrieve all players
 */
router.get('/', async (req, res, next) => {
  try {
    const players = await Player.findAll();
    res.json(players);
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
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
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
    res.status(201).json(player);
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
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    await player.update(req.body);
    res.json(player);
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
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    await player.destroy();
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
