const express = require('express');
const { Player } = require('../database/models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (error) {
    next(error);
  }
});

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

router.post('/', async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
