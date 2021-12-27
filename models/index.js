const {Sequelize} = require('sequelize');

/**
 * Sequelize database object
 */
exports.sequelize = new Sequelize(process.env.DB_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
