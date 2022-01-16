const userController = require('../controllers/users');

module.exports = (router, passport) => {
  // #region APIDOC
  /**
   * @openapi
   * /api/users/{emailAddress}:
   *   post:
   *     tags:
   *     - user
   *     summary: Sign up with email address and password
   *     security: []
   *     parameters:
   *       - in: path
   *         name: emailAddress
   *         required: true
   *         schema:
   *           type: string
   *         example: test@test.com
   *     requestBody:
   *       description: Pass password and user name for registration
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *           example:
   *             password: Aa123123!
   *             username: Test123
   *     responses:
   *       200:
   *         description: Sign up success.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data: null
   *       400:
   *         description: Sign up fail for some reason.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             examples:
   *               InvalidEmailAddress:
   *                 value:
   *                   status: fail
   *                   data:
   *                     emailAddress: Invalid
   *               InvalidPassword:
   *                 value:
   *                   status: fail
   *                   data:
   *                     password: Invalid
   *               InvalidUserName:
   *                 value:
   *                   status: fail
   *                   data:
   *                     username: Invalid
   *               EmailAddressTaken:
   *                 value:
   *                   status: fail
   *                   data:
   *                     emailAddress: EmailAddressTaken
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             examples:
   *               DatabaseError:
   *                 value:
   *                   status: error
   *                   message: DatabaseError
   *               EmailServiceError:
   *                 value:
   *                   status: error
   *                   message: EmailServiceError
   */
  // #endregion
  router.post(
      '/api/users/:emailAddress',
      userController.signUp,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users/current/info:
   *   get:
   *     tags:
   *     - user
   *     summary: Get current user info
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Return user name and email address.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data:
   *                 username: Test123
   *                 emailAddress: test@test.com
   *       401:
   *         description: Current session is unauthorized.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             example:
   *               status: fail
   *               data:
   *                 session: Unauthorized
   */
  // #endregion
  router.get(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.getUserInfo,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users/current/info:
   *   put:
   *     tags:
   *     - user
   *     summary: Update current user info
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       description: Enter new user name
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *           example:
   *             newUsername: Test123
   *     responses:
   *       200:
   *         description: Update success.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data: null
   *       400:
   *         description: Fail for invalid user name.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             example:
   *               status: fail
   *               data:
   *                 username: Invalid
   *       401:
   *         description: Current session is unauthorized.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             example:
   *               status: fail
   *               data:
   *                 session: Unauthorized
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             example:
   *               status: error
   *               message: DatabaseError
   */
  // #endregion
  router.put(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.updateUserInfo,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users/current/password:
   *   put:
   *     tags:
   *     - user
   *     summary: Update current user password
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       description: Enter old and new password
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *           example:
   *             oldPassword: Aa123123!
   *             newPassword: Aa123123@
   *     responses:
   *       200:
   *         description: Update success.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data: null
   *       400:
   *         description: Fail for some reason.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             examples:
   *               InvalidOldPassword:
   *                 value:
   *                   status: fail
   *                   data:
   *                     oldPassword: Invalid
   *               InvalidNewPassword:
   *                 value:
   *                   status: fail
   *                   data:
   *                     newPassword: Invalid
   *       401:
   *         description: Current session is unauthorized.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             example:
   *               status: fail
   *               data:
   *                 session: Unauthorized
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             example:
   *               status: error
   *               message: DatabaseError
   */
  // #endregion
  router.put(
      '/api/users/current/password',
      userController.ensureAuthenticated,
      userController.updateUserPassword,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users/verify:
   *   get:
   *     tags:
   *     - user
   *     summary: Verify account.
   *     security: []
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         example: abcd1234
   *     responses:
   *       200:
   *         description: >
   *           Verify success.<br>
   *           Login automatically and redirect to dashboard page.
   *       400:
   *         description: Verify fail and render a error page.
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             example:
   *               status: error
   *               message: DatabaseError
   */
  // #endregion
  router.get(
      '/api/users/verify',
      userController.verifyUser,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users/verify/resend:
   *   post:
   *     tags:
   *     - user
   *     summary: Resend verification mail.
   *     security: []
   *     requestBody:
   *       description: enter email address
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *           example:
   *             emailAddress: test@test.com
   *     responses:
   *       200:
   *         description: Success and resend verification email.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data: null
   *       400:
   *         description: Fail for some reason.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             examples:
   *               InvalidEmailAddress:
   *                 value:
   *                   status: fail
   *                   data:
   *                     emailAddress: Invalid
   *               EmailAddressNotExisted:
   *                 value:
   *                   status: fail
   *                   data:
   *                     emailAddress: NotExisted
   *               AlreadyVerified:
   *                 value:
   *                   status: fail
   *                   data:
   *                     verified: true
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             examples:
   *               DatabaseError:
   *                 value:
   *                   status: error
   *                   message: DatabaseError
   *               EmailServiceError:
   *                 value:
   *                   status: error
   *                   message: EmailServiceError
   */
  // #endregion
  router.post(
      '/api/users/verify/resend',
      userController.resendVerificationMail,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users:
   *   get:
   *     tags:
   *     - user
   *     summary: List all users
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: query
   *         name: draw
   *         required: true
   *         schema:
   *           type: integer
   *         example: 1
   *         description: a sequence id for DataTable
   *       - in: query
   *         name: start
   *         required: true
   *         schema:
   *           type: integer
   *         example: 0
   *         description: the offset of items to skip
   *       - in: query
   *         name: length
   *         required: true
   *         schema:
   *           type: integer
   *         example: 10
   *         description: the numbers of items to return
   *     responses:
   *       200:
   *         description: Return 10 users.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data:
   *                 draw: 1
   *                 recordsTotal: 1
   *                 recordsFiltered: 1
   *                 data:
   *                   -
   *                     - test@test.com
   *                     - Test123
   *                     - 2022-01-01T01:02:03.000Z
   *                     - 10
   *                     - 2022-01-01T01:02:03.000Z
   *       401:
   *         description: Current session is unauthorized.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             example:
   *               status: fail
   *               data:
   *                 session: Unauthorized
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             example:
   *               status: error
   *               message: DatabaseError
   */
  // #endregion
  router.get(
      '/api/users',
      userController.ensureAuthenticated,
      userController.listUsers,
  );

  // #region APIDOC
  /**
   * @openapi
   * /api/users/statistics:
   *   get:
   *     tags:
   *     - user
   *     summary: Get user statistics for dashboard
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: >
   *           Return total users, active users today,
   *           and average active user in 7 days.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseSuccess'
   *             example:
   *               status: success
   *               data:
   *                 total: 16
   *                 activeUsers: 3
   *                 activeUsers7days: 2
   *       401:
   *         description: Current session is unauthorized.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             example:
   *               status: fail
   *               data:
   *                 session: Unauthorized
   *       503:
   *         description: Server issues.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseError'
   *             example:
   *               status: error
   *               message: DatabaseError
   */
  // #endregion
  router.get(
      '/api/users/statistics',
      userController.ensureAuthenticated,
      userController.getUsersStatistics,
  );
};
