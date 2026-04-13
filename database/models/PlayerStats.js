const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PlayerStats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    runs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rbis: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    atBats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};
