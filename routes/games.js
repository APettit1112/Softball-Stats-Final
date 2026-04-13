const express = require('express');
const { Game } = require('../database/models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    await game.update(req.body);
    res.json(game);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    await game.destroy();
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
