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
  try {
    user = await User.create({
      providerId: emailAddress,
      provider: 'local',
      emailAddress,
      password: User.hashPassword(password),
      username,
      verified: 0,
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
