const userService = require('../services/users');

module.exports = (router) => {
  router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/dashboard');
    } else {
      res.render('index');
    }
  });

  router.get('/dashboard', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        userService.updateSessionTimestamp(req.user);
      } catch (err) {
        console.log(err);
      }

      res.render('dashboard');
    } else {
      res.redirect('/');
    }
  });

  router.get('/verifyError', (req, res) => {
    res.render('verifyError');
  });
};
