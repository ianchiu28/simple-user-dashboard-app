const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
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
