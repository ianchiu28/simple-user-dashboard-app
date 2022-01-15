module.exports = (router, passport) => {
  /**
   * @openapi
   * /auth/local:
   *   post:
   *     tags:
   *     - auth
   *     summary: "Sign in with local strategy"
   *     security: []
   *     requestBody:
   *       description: Enter email address and password that registered before
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *           example:
   *             emailAddress: test@test.com
   *             password: Aa123123!
   *     responses:
   *       200:
   *         description: >
   *           Login success.<br>
   *           The session ID is returned in a cookie named `connect.sid`.<br>
   *           You need to include this cookie in subsequent requests.
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: connect.sid=abcde12345;
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data: null
   *       400:
   *         description: Login fail for some reason.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             examples:
   *               InvalidEmailAddress:
   *                 value:
   *                   status: fail
   *                   data:
   *                     auth: InvalidEmailAddress
   *               InvalidPassword:
   *                 value:
   *                   status: fail
   *                   data:
   *                     auth: InvalidPassword
   *               NotVerified:
   *                 value:
   *                   status: fail
   *                   data:
   *                     auth: NotVerified
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             example:
   *               status: error
   *               message: ServerError
   */
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

  /**
   * @openapi
   * /auth/google:
   *   post:
   *     tags:
   *     - auth
   *     summary: "Sign in with google strategy"
   *     security: []
   *     responses:
   *       200:
   *         description: >
   *           Login success. Redirect to dashboard page.<br>
   *           Save account into databse automatically
   *           if this account doesn't exist in databse.<br>
   *           The session ID is returned in a cookie named `connect.sid`.<br>
   *           You need to include this cookie in subsequent requests.
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: connect.sid=abcde12345;
   */
  router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
  }));

  router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  }));

  /**
   * @openapi
   * /auth/facebook:
   *   post:
   *     tags:
   *     - auth
   *     summary: "Sign in with facebook strategy"
   *     security: []
   *     responses:
   *       200:
   *         description: >
   *           Login success. Redirect to dashboard page.<br>
   *           Save account into databse automatically
   *           if this account doesn't exist in databse.<br>
   *           The session ID is returned in a cookie named `connect.sid`.<br>
   *           You need to include this cookie in subsequent requests.
   *         headers:
   *           Set-Cookie:
   *             schema:
   *               type: string
   *               example: connect.sid=abcde12345;
   */
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
