const userController = require('../controllers/users');

module.exports = (router, passport) => {
  router.post(
      '/api/users/:emailAddress',
      userController.signUp,
  );

  router.get(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.getUserInfo,
  );

  router.put(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.updateUserInfo,
  );

  router.put(
      '/api/users/current/password',
      userController.ensureAuthenticated,
      userController.updateUserPassword,
  );
};
