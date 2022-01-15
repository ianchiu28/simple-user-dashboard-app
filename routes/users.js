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

  router.get(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.getUserInfo,
  );

  router.put(
      '/api/users/current/info',
      userController.ensureAuthenticated,
      userController.updateUserInfo,
  );

  router.put(
      '/api/users/current/password',
      userController.ensureAuthenticated,
      userController.updateUserPassword,
  );

  router.get(
      '/api/users/verify',
      userController.verifyUser,
  );

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
