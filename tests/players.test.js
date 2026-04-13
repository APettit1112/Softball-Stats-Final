process.env.DB_NAME = ':memory:';

const request = require('supertest');
const app = require('../app');
const { sequelize, Player } = require('../database/models');

describe('Players API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/players returns an empty array', async () => {
    const response = await request(app).get('/api/players');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/players creates a player', async () => {
    const response = await request(app)
      .post('/api/players')
      .send({ name: 'Avery Johnson', position: 'Pitcher', team: 'Blue Sox' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Avery Johnson');
    expect(response.body.team).toBe('Blue Sox');

    const player = await Player.findByPk(response.body.id);
    expect(player).not.toBeNull();
  });
});
