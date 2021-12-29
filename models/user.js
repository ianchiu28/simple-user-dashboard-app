module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
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

  return User;
};
