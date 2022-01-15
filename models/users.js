const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  /**
   * @openapi
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       properties:
   *         providerId:
   *           type: string
   *           example: test@test.com
   *         provider:
   *           type: string
   *           example: local
   *         emailAddress:
   *           type: string
   *           example: test@test.com
   *         password:
   *           type: string
   *           example: Aa123123!
   *         username:
   *           type: string
   *           example: Test123
   *         verified:
   *           type: integer
   *         verifiedToken:
   *           type: string
   *         signUpTimestamp:
   *           type: string
   *           example: 2022-01-01T01:02:03.000Z
   *         loginTimes:
   *           type: integer
   *           example: 12
   *         sessionTimestamp:
   *           type: string
   *           example: 2022-01-01T01:02:03.000Z
   *       required:
   *         - providerId
   */
  const User = sequelize.define('User', {
    providerId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    provider: {
      type: DataTypes.STRING,
    },
    emailAddress: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    verified: {
      type: DataTypes.INTEGER,
    },
    verifiedToken: {
      type: DataTypes.STRING,
    },
    signUpTimestamp: {
      type: DataTypes.DATE,
    },
    loginTimes: {
      type: DataTypes.INTEGER,
    },
    sessionTimestamp: {
      type: DataTypes.DATE,
    },
  });

  /**
   * Hashing the password.
   * @param {string} password
   * @return {string} encrypted password
   */
  User.hashPassword = (password) => bcrypt.hashSync(password, 10);

  /**
   * Check if the password match tje encrypted password.
   * @param {string} password
   * @param {string} encrypted
   * @return {boolean} match or not
   */
  User.comparePassword = (password, encrypted) => {
    return bcrypt.compareSync(password, encrypted);
  };

  return User;
};
