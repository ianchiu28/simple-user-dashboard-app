const LocalStrategy = require('passport-local').Strategy;

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
                password: User.hashPassword(password),
                username: emailAddress,
                signUpTimestamp: new Date().toISOString(),
                loginTimes: 0,
              })
              .then((user) => done(null, user))
              .catch((err) => done(err));
        })
        .catch((err) => done(err));
  }));

  /**
   * Local login strategy.
   * Authenticate with email address and password.
   */
  passport.use('local-login', new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',
  }, (emailAddress, password, done) => {
    // check if email address existed
    User
        .findOne({where: {emailAddress}})
        .then((user)=>{
          // not existed
          if (!user) {
            return done(null, false, {message: 'InvalidEmailAddress'});
          }

          // invalid password
          if (!User.comparePassword(password, user.password)) {
            return done(null, false, {message: 'InvalidPassword'});
          }

          return done(null, user);
        })
        .catch((err) => done(err));
  }));

  /**
   * Serialize user.
   * Only pass id into session.
   */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /**
   * Deserialize user.
   * Find user by primary key(id)
   */
  passport.deserializeUser((id, done) => {
    User
        .findByPk(id)
        .then((user) => done(null, user))
        .catch((err) => done(err));
  });
};
