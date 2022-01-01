exports.signUp = (req, res) => {
  res.json({a: 'sign up'});
};

exports.logIn = (req, res) => {
  res.json({a: 'log in'});
};

exports.googleAuth = (req, res) => {
  res.json({a: 'google'});
};

exports.facebookAuth = (req, res) => {
  res.json({a: 'facebook'});
};
