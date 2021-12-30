module.exports = (router, passport) => {
  router.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    res.json({a: 'hi'});
  });
};
