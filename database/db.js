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

if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('✅ Database setup complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = sequelize;
