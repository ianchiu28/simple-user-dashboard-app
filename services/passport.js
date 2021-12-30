const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const {User} = require('../models');

module.exports = (passport) => {
  /**
   * Local sign up strategy.
   * Create a new user.
   */
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',
  }, (emailAddress, password, done) => {
    // check if email address existed
    User
        .findOne({where: {emailAddress}})
        .then((user)=>{
          // existed
          if (user) {
            return done(null, false, {message: 'EmailAddressTaken'});
          }

          // not existed, create a new one
          User
              .create({
                emailAddress,
                password: bcrypt.hashSync(password, 10),
                username: emailAddress,
                signUpTimestamp: new Date().toISOString(),
                loginTimes: 0,
              })
              .then((user) => done(null, user))
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
