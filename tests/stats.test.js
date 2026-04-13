process.env.DB_NAME = ':memory:';

const request = require('supertest');
const app = require('../app');
const { sequelize, Player, Game } = require('../database/models');

describe('Stats API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Player.create({ name: 'Avery Johnson', position: 'Pitcher' });
    await Game.create({ date: '2026-04-13', opponent: 'Green Giants', location: 'Home Stadium' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /stats creates a player stat record', async () => {
    const player = await Player.findOne();
    const game = await Game.findOne();

    const response = await request(app)
      .post('/api/stats')
      .send({
        playerId: player.id,
        gameId: game.id,
        hits: 2,
        runs: 1,
        rbis: 3,
        atBats: 4,
      });

    expect(response.status).toBe(201);
    expect(response.body.hits).toBe(2);
    expect(response.body.gameId).toBe(game.id);
  });
});
