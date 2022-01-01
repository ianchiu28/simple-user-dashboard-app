const {Sequelize, DataTypes} = require('sequelize');

/**
 * Sequelize database object
 */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
exports.sequelize = sequelize;

/**
 * User Model
 */
exports.User = require('./users')(sequelize, DataTypes);
