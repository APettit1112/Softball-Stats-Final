const { sequelize, User, Player, Game, PlayerStats } = require('./models');
const bcrypt = require('bcrypt');

async function seed() {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await User.bulkCreate([
    {
      username: 'coach',
      email: 'coach@example.com',
      password: hashedPassword,
      role: 'admin',
    },
    {
      username: 'assistant',
      email: 'assistant@example.com',
      password: hashedPassword,
      role: 'user',
    },
    {
      username: 'statkeeper',
      email: 'stats@example.com',
      password: hashedPassword,
      role: 'user',
    },
  ]);

  const players = await Player.bulkCreate([
    { name: 'Avery Johnson', jerseyNumber: 12, position: 'Pitcher' },
    { name: 'Mia Thompson', jerseyNumber: 7, position: 'Catcher' },
    { name: 'Emily Parker', jerseyNumber: 21, position: 'Shortstop' },
    { name: 'Nina Brooks', jerseyNumber: 34, position: 'Outfielder' },
  ]);

  const games = await Game.bulkCreate([
    { date: '2026-04-13', opponent: 'Green Giants', finalScore: '5-3' },
    { date: '2026-04-15', opponent: 'Red Hawks', finalScore: '4-4' },
    { date: '2026-04-18', opponent: 'Silver Storm', finalScore: '6-2' },
  ]);

  const statsData = [
    { playerId: players[0].id, gameId: games[0].id, hits: 2, runs: 1, RBIs: 2, errors: 0 },
    { playerId: players[1].id, gameId: games[0].id, hits: 1, runs: 0, RBIs: 1, errors: 1 },
    { playerId: players[2].id, gameId: games[0].id, hits: 3, runs: 2, RBIs: 2, errors: 0 },
    { playerId: players[3].id, gameId: games[0].id, hits: 0, runs: 0, RBIs: 0, errors: 0 },
  ];

  await PlayerStats.bulkCreate(statsData);

  console.log('Database seeded successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});