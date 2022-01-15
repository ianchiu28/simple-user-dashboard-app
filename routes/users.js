const userController = require('../controllers/users');

module.exports = (router, passport) => {
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
  router.post(
      '/api/users/:emailAddress',
      userController.signUp,
  );

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
   *         description: Sign up success.
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
  router.get(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.getUserInfo,
  );

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
   *         description: Fail for some reason.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ResponseFail'
   *             examples:
   *               InvalidUserName:
   *                 value:
   *                   status: fail
   *                   data:
   *                     username: Invalid
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
   *             examples:
   *               DatabaseError:
   *                 value:
   *                   status: error
   *                   message: DatabaseError
   */
  router.put(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.updateUserInfo,
  );

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
   *             examples:
   *               DatabaseError:
   *                 value:
   *                   status: error
   *                   message: DatabaseError
   */
  router.put(
      '/api/users/current/password',
      userController.ensureAuthenticated,
      userController.updateUserPassword,
  );

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
   *             examples:
   *               DatabaseError:
   *                 value:
   *                   status: error
   *                   message: DatabaseError
   */
  router.get(
      '/api/users/verify',
      userController.verifyUser,
  );

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
   *         description: Resend up success.
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
  router.post(
      '/api/users/verify/resend',
      userController.resendVerificationMail,
  );

  router.get(
      '/api/users',
      userController.ensureAuthenticated,
      userController.listUsers,
  );

  router.get(
      '/api/users/statistics',
      userController.ensureAuthenticated,
      userController.getUsersStatistics,
  );
};
