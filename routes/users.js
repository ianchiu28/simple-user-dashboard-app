const userController = require('../controllers/users');

module.exports = (router, passport) => {
  router.post(
      '/api/users/:emailAddress',
      userController.signUp,
  );
};
