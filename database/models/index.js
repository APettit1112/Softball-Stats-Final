const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const Player = require('./Player')(sequelize, DataTypes);
const Game = require('./Game')(sequelize, DataTypes);
const PlayerStats = require('./PlayerStats')(sequelize, DataTypes);

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
