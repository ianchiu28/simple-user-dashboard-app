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

  router.get(
      '/api/users/verify',
      userController.verifyUser,
  );

  router.post(
      '/api/users/verify/resend',
      userController.resendVerificationMail,
  );

  router.get(
      '/api/users',
      userController.ensureAuthenticated,
      userController.listUsers,
  );
};
