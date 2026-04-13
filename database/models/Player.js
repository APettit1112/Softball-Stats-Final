const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Player', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    team: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
