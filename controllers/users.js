const {User} = require('../models');

exports.signUp = async (req, res) => {
  const {emailAddress} = req.params;
  const {password, username} = req.body;

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

  // set up login session
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    }

    res.json({
      status: 'success',
      data: null,
    });
  });
};
