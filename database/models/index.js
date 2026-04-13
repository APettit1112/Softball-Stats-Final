const sequelize = require('../db');

const User = require('./User')(sequelize);
const Player = require('./Player')(sequelize);
const Game = require('./Game')(sequelize);
const PlayerStats = require('./PlayerStats')(sequelize);

Player.hasMany(PlayerStats, { foreignKey: 'playerId' });
Game.hasMany(PlayerStats, { foreignKey: 'gameId' });
PlayerStats.belongsTo(Player, { foreignKey: 'playerId' });
PlayerStats.belongsTo(Game, { foreignKey: 'gameId' });

module.exports = {
  sequelize,
  User,
  Player,
  Game,
  PlayerStats,
};
