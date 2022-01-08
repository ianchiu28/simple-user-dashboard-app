module.exports = (router) => {
  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    } else {
      res.render('index');
    }
  });

  router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('dashboard');
    } else {
      res.redirect('/');
    }
  });

  router.get('/verifyError', (req, res) => {
    res.render('verifyError');
  });
};
