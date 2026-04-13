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
    RBIs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    errors: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};
