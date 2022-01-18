const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const {User} = require('../models');
const userService = require('../services/users');

module.exports = (passport) => {
  /**
   * Local login strategy.
   * Authenticate with email address and password.
   */
  passport.use('local', new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',
  }, (emailAddress, password, done) => {
    // check if email address existed
    userService
        .getUser(emailAddress)
        .then((user)=> {
          // not existed
          if (!user) {
            return done(null, false, 'InvalidEmailAddress');
          }

          // invalid password
          if (!userService.comparePassword(password, user.password)) {
            return done(null, false, 'InvalidPassword');
          }

          // not verified
          if (user.verified === 0) {
            return done(null, false, 'NotVerified');
          }

          // increase login times
          userService
              .updateUser(user.providerId, {loginTimes: user.loginTimes + 1})
              .then(() => done(null, user))
              .catch((err) => done(err));
        })
        .catch((err) => done(err));
  }));

  /**
   * Google login strategy.
   * Authenticate with Google OAuth2.0.
   */
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true,
  }, (accessToken, refreshToken, profile, done) => {
    const providerId = profile.id;
    const emailAddress = profile.emails ? profile.emails[0].value : undefined;
    const username = profile.displayName;

    // check if email address existed
    userService
        .getUser(emailAddress)
        .then((user)=>{
          // existed, login
          if (user) {
            // increase login times
            userService
                .updateUser(user.providerId, {loginTimes: user.loginTimes + 1})
                .then(() => done(null, user))
                .catch((err) => done(err));
            return;
          }

          // not existed, create a new one and login
          userService
              .createUserSocial(providerId, 'google', emailAddress, username)
              .then((user) => done(null, user))
              .catch((err) => done(err));
        })
        .catch((err) => done(err));
  }));

  /**
   * Facebook login strategy.
   * Authenticate with Facebook OAuth2.0.
   */
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['email', 'displayName'],
  }, (accessToken, refreshToken, profile, done) => {
    const providerId = profile.id;
    const emailAddress = profile.emails ? profile.emails[0].value : undefined;
    const username = profile.displayName;

    // check if email address existed
    userService
        .getUser(emailAddress)
        .then((user)=>{
          // existed, login
          if (user) {
            // increase login times
            userService
                .updateUser(user.providerId, {loginTimes: user.loginTimes + 1})
                .then(() => done(null, user))
                .catch((err) => done(err));
            return;
          }

          // not existed, create a new one and login
          userService
              .createUserSocial(providerId, 'facebook', emailAddress, username)
              .then((user) => done(null, user))
              .catch((err) => done(err));
        })
        .catch((err) => done(err));
  }));

  /**
   * Serialize user.
   * Only pass primary key(providerId) into session.
   */
  passport.serializeUser((user, done) => {
    done(null, user.providerId);
  });

  /**
   * Deserialize user.
   * Find user by primary key(providerId)
   */
  passport.deserializeUser((providerId, done) => {
    User
        .findByPk(providerId)
        .then((user) => done(null, user))
        .catch((err) => done(err));
  });
};
