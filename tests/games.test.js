process.env.DB_NAME = ':memory:';

const request = require('supertest');
const app = require('../app');
const { sequelize, Game } = require('../database/models');

describe('Games API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/games returns an empty array', async () => {
    const response = await request(app).get('/api/games');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/games creates a new game', async () => {
    const response = await request(app)
      .post('/api/games')
      .send({ date: '2026-04-13', opponent: 'Green Giants', location: 'Home Stadium' });

    expect(response.status).toBe(201);
    expect(response.body.opponent).toBe('Green Giants');

    const game = await Game.findByPk(response.body.id);
    expect(game).not.toBeNull();
  });
});
