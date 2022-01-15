module.exports = (sequelize, DataTypes) => {
  /**
   * @openapi
   * components:
   *   schemas:
   *     Statistics:
   *       type: object
   *       properties:
   *          date:
   *            type: string
   *            example: 2022-01-01 00:00:00+00
   *          activeUser:
   *            type: integer
   *           example: 12
   *       required:
   *         - date
   */
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
