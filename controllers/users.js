const crypto = require('crypto');

const {User} = require('../models');
const userService = require('../services/users');

/**
 * Sign up a new user.
 * @param {object} req express request object
 * @param {object} res express response object
 */
exports.signUp = async (req, res) => {
  const {emailAddress} = req.params;
  const {password, username} = req.body;

  // sanitize input
  if (!userService.validateEmail(emailAddress)) {
    res.status(400).json({
      status: 'fail',
      data: {
        emailAddress: 'Invalid',
      },
    });
    return;
  }

  if (!userService.validatePassword(password)) {
    res.status(400).json({
      status: 'fail',
      data: {
        password: 'Invalid',
      },
    });
    return;
  }

  if (!userService.validateUsername(username)) {
    res.status(400).json({
      status: 'fail',
      data: {
        username: 'Invalid',
      },
    });
    return;
  }

  // check if email address existed
  let user;
  try {
    user = await User.findOne({where: {providerId: emailAddress}});
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  // already existed
  if (user) {
    res.status(400).json({
      status: 'fail',
      data: {
        emailAddress: 'EmailAddressTaken',
      },
    });
    return;
  }

  // not existed, create a new one
  const verifiedToken = crypto.randomBytes(20).toString('hex');
  try {
    user = await User.create({
      providerId: emailAddress,
      provider: 'local',
      emailAddress,
      password: User.hashPassword(password),
      username,
      verified: 0,
      verifiedToken,
      signUpTimestamp: new Date().toISOString(),
      loginTimes: 0,
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  // send verification mail
  try {
    await userService.sendMail(emailAddress, verifiedToken);
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'EmailServiceError',
    });
    return;
  }

  res.json({
    status: 'success',
    data: null,
  });
};

/**
 * Ensure request is authenticated.
 * @middleware
 * @param {object} req express request object
 * @param {object} res express response object
 * @param {function} next express next middleware function
 */
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({
      status: 'fail',
      data: {
        session: 'Unauthorized',
      },
    });
  }
};

/**
 * Get user's information.
 * @param {object} req express request object
 * @param {object} res express response object
 */
exports.getUserInfo = async (req, res) => {
  const {username, emailAddress} = req.user;

  res.json({
    status: 'success',
    data: {
      username: username || 'N/A',
      emailAddress: emailAddress || 'N/A',
    },
  });
};

/**
 * Update user's information.
 * @param {object} req express request object
 * @param {object} res express response object
 */
exports.updateUserInfo = async (req, res) => {
  const {providerId} = req.user;
  const {newUsername} = req.body;

  if (!userService.validateUsername(newUsername)) {
    res.status(400).json({
      status: 'fail',
      data: {
        username: 'Invalid',
      },
    });
    return;
  }

  // update user info
  try {
    await User.update({username: newUsername}, {
      where: {
        providerId,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  res.json({
    status: 'success',
    data: null,
  });
};

/**
 * Update user's password.
 * @param {object} req express request object
 * @param {object} res express response object
 */
exports.updateUserPassword = async (req, res) => {
  const {providerId, password} = req.user;
  const {oldPassword, newPassword} = req.body;

  // sanitize input
  if (!userService.validatePassword(newPassword)) {
    res.status(400).json({
      status: 'fail',
      data: {
        newPassword: 'Invalid',
      },
    });
    return;
  }

  // check old password
  if (!User.comparePassword(oldPassword, password)) {
    res.status(400).json({
      status: 'fail',
      data: {
        oldPassword: 'Invalid',
      },
    });
    return;
  }

  // update user info
  try {
    await User.update({password: User.hashPassword(newPassword)}, {
      where: {
        providerId,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  res.json({
    status: 'success',
    data: null,
  });
};

/**
 * Verify user.
 * @param {object} req express request object
 * @param {object} res express response object
 */
exports.verifyUser = async (req, res) => {
  const {token} = req.query;

  // find user by token
  let user;
  try {
    user = await User.findOne({where: {verifiedToken: token}});
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  // if not existd
  if (!user) {
    return res.redirect('/verifyError');
  }

  // update user status: set verified to true and remove verifiedToken
  try {
    await User.update({verified: 1, verifiedToken: null}, {
      where: {
        providerId: user.providerId,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  // set login and redirect to dashboard
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    }
    return res.redirect('/dashboard');
  });
};

/**
 * Resend verification mail to user.
 * @param {object} req express request object
 * @param {object} res express response object
 */
exports.resendVerificationMail = async (req, res) => {
  const {emailAddress} = req.body;

  // sanitize input
  if (!userService.validateEmail(emailAddress)) {
    res.status(400).json({
      status: 'fail',
      data: {
        emailAddress: 'Invalid',
      },
    });
    return;
  }

  // check if email address existed and its verified status
  let user;
  try {
    user = await User.findOne({where: {providerId: emailAddress}});
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  // not existed
  if (!user) {
    res.status(400).json({
      status: 'fail',
      data: {
        emailAddress: 'NotExisted',
      },
    });
    return;
  }

  // already verified
  if (user.verified === 1) {
    res.status(400).json({
      status: 'fail',
      data: {
        verified: true,
      },
    });
  }

  // update verified token
  const verifiedToken = crypto.randomBytes(20).toString('hex');
  try {
    await User.update({verifiedToken}, {
      where: {
        providerId: user.providerId,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'DatabaseError',
    });
    return;
  }

  // send verification mail
  try {
    await userService.sendMail(emailAddress, verifiedToken);
  } catch (err) {
    console.log(err);
    res.status(503).json({
      status: 'error',
      message: 'EmailServiceError',
    });
    return;
  }

  res.json({
    status: 'success',
    data: null,
  });
};
