const userController = require('../controllers/users');

module.exports = (router, passport) => {
  router.post(
      '/api/users/signUp',
      passport.authenticate('local-signUp'),
      userController.signUp,
  );
};
