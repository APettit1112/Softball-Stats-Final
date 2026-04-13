const { sequelize, User, Player, Game, PlayerStats } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  const user = await User.create({
    username: 'coach',
    email: 'coach@example.com',
    password: 'password123',
  });

  const player = await Player.create({
    name: 'Avery Johnson',
    position: 'Pitcher',
    team: 'Blue Sox',
  });

  const game = await Game.create({
    date: '2026-04-13',
    opponent: 'Green Giants',
    location: 'Home Stadium',
  });

  await PlayerStats.create({
    playerId: player.id,
    gameId: game.id,
    hits: 2,
    runs: 1,
    rbis: 3,
    atBats: 4,
  });

  console.log('✅ Database seeded successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
