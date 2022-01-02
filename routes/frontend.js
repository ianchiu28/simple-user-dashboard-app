module.exports = (router) => {
  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    } else {
      res.render('index', {message: req.flash('message')});
    }
  });

  router.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('dashboard');
    } else {
      res.redirect('/');
    }
  });
};
