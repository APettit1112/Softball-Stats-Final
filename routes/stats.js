const express = require('express');
const { PlayerStats, Player, Game } = require('../database/models');
const router = express.Router();

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

router.post('/', async (req, res, next) => {
  try {
    const stat = await PlayerStats.create(req.body);
    res.status(201).json(stat);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
