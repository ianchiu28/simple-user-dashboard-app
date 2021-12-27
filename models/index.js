const {Sequelize, DataTypes} = require('sequelize');

/**
 * Sequelize database object
 */
const sequelize = new Sequelize(process.env.DB_URL, {
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
exports.users = require('./user')(sequelize, DataTypes);
