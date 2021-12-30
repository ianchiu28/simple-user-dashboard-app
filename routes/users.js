module.exports = (router, passport) => {
  router.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    res.json({a: 'hi'});
  });

  router.post('/login', passport.authenticate('local-login'), (req, res) => {
    res.json({a: 'ho'});
  });
};
