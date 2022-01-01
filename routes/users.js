module.exports = (router, passport) => {
  router.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    res.json({a: 'hi'});
  });

  router.post('/login', passport.authenticate('local-login'), (req, res) => {
    res.json({a: 'ho'});
  });

  router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get(
      '/auth/google/callback',
      passport.authenticate('google'),
      (req, res) => {
        res.json({a: 'google!'});
      });
};
