const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    opponent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    finalScore: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
