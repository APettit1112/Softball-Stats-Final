process.env.DB_NAME = ':memory:';

const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../database/models');

describe('Games API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/games - create game', async () => {
    const res = await request(app)
      .post('/api/games')
      .send({
        opponent: 'Tigers',
        date: '2026-04-10',
        finalScore: '5-3',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
