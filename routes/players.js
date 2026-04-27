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

router.get('/', async (req, res, next) => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const { page, limit, offset } = parsePaginationParams(req.query);

    let where = {};

    if (search) {
      where = buildSearchFilter(search, ['name', 'position'], Sequelize);
    }

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

router.get('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Player ID');

    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

    res.json({ success: true, data: player });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, position, number } = req.body;

    if (!name || !position || number === undefined) {
      throw new AppError(
        'Missing required fields: name, position, number',
        400,
        'VALIDATION_ERROR'
      );
    }

    const playerNumber = parseInt(number, 10);

    if (isNaN(playerNumber) || playerNumber <= 0 || playerNumber > 999) {
      throw new AppError(
        'Player number must be between 1 and 999',
        400,
        'VALIDATION_ERROR'
      );
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

router.put('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Player ID');

    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

    const { name, position, number } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (position !== undefined) updateData.position = position.trim();

    if (number !== undefined) {
      const playerNumber = parseInt(number, 10);
      updateData.number = playerNumber;
    }

    await player.update(updateData);

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: player,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    validateId(req.params.id, 'Player ID');

    const player = await Player.findByPk(req.params.id);
    validateResourceExists(player, 'Player');

    await player.destroy();

    res.json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;