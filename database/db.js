const path = require('path');
const { Sequelize } = require('sequelize');

require('dotenv').config();

const storage = process.env.DB_NAME || 'softball.db';
const storagePath = storage === ':memory:' ? storage : path.resolve(__dirname, '..', storage);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
});

module.exports = sequelize;
