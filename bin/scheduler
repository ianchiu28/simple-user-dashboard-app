#! /app/.heroku/node/bin/node
const {Op} = require('sequelize');
const {User, Statistic} = require('../models');

/**
 * Scheduler main function
 */
function main() {
  console.log('Scheduler start');

  // get active users yesterday
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);

  User
      .count({
        where: {
          sessionTimestamp: {
            [Op.between]: [yesterday, today],
          },
        },
      })
      .then((activeUser) => {
        // save to db
        Statistic
            .upsert({date: yesterday, activeUser})
            .then(() => {
              console.log('Scheduler finish');
              process.exit();
            })
            .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
}

main();
