module.exports = (router, passport) => {
  router.post('/auth/local', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  }));

  router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  }));

  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
  }));

  router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  }));

  router.get('/auth/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
