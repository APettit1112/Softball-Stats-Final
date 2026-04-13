process.env.DB_NAME = ':memory:';

const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../database/models');

describe('Players API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let playerId;

  test('POST /api/players - create player', async () => {
    const res = await request(app)
      .post('/api/players')
      .send({
        name: 'Sarah Johnson',
        jerseyNumber: 12,
        position: 'Pitcher',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');

    playerId = res.body.id;
  });

  test('GET /api/players - get all players', async () => {
    const res = await request(app).get('/api/players');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
