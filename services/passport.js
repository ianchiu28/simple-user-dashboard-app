const LocalStrategy = require('passport-local').Strategy;

const {User} = require('../models');

module.exports = (passport) => {
  /**
   * Local login strategy.
   * Authenticate with username and password.
   */
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',
  }, (emailAddress, password, done) => {
    User
        .findOne({where: {emailAddress}})
        .then((user)=>{
          if (user) {
            return done(null, false, {message: 'EmailAddressTaken'});
          }

          User
              .create({
                emailAddress,
                password,
                username: emailAddress,
                signUpTimestamp: new Date().toISOString(),
                loginTimes: 0,
              })
              .then((user) => {
                return done(null, user);
              })
              .catch((err) => done(err));
        })
        .catch((err) => done(err));
  }));
};


// if (!user) {
//   return done(null, false, {message: 'InvalidEmailAddress'});
// }
// if (user.password !== password) {
//   return done(null, false, {message: 'InvalidPassword'});
// }
