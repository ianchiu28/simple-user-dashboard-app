module.exports = (sequelize, DataTypes) => {
  const Statistic = sequelize.define('Statistic', {
    date: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
    activeUser: {
      type: DataTypes.INTEGER,
    },
  });
  return Statistic;
};
