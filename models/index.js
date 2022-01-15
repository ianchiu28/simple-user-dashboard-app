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


/**
 * Statistic Model
 */
exports.Statistic = require('./statistics')(sequelize, DataTypes);

/**
 * @openapi
 * components:
 *   schemas:
 *     ResponseSuccess:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *     ResponseFail:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: fail
 *         data:
 *           type: object
 *     ResponseError:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 */
