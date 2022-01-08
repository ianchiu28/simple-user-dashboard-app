module.exports = (router, passport) => {
  router.post('/auth/local', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      // error
      if (err) {
        console.log(err);
        return res.status(503).json({
          status: 'error',
          error: 'ServerError',
        });
      }

      // login failed
      if (!user) {
        console.log(info);
        return res.status(400).json({
          status: 'fail',
          data: {
            auth: info,
          },
        });
      }

      // establish session
      req.login(user, (err) => {
        if (err) {
          console.log(err);
          return res.status(503).json({
            status: 'error',
            error: 'ServerError',
          });
        }

        return res.json({
          status: 'success',
          data: null,
        });
      });
    })(req, res, next);
  });

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
