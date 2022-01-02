module.exports = (router) => {
  router.get('/', function(req, res, next) {
    res.render('index', {message: req.flash('message')});
  });

  router.get('/dashboard', (req, res) => {
    res.render('dashboard');
  });
};
