const userController = require('../controllers/users');

module.exports = (router, passport) => {
  router.post(
      '/api/users/signUp',
      passport.authenticate('local-signUp'),
      userController.signUp,
  );

  router.post(
      '/api/users/logIn',
      passport.authenticate('local-logIn'),
      userController.login,
  );

  router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get(
      '/auth/google/callback',
      passport.authenticate('google'),
      userController.googleAuth,
  );

  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
  }));

  router.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook'),
      userController.facebookAuth,
  );
};
