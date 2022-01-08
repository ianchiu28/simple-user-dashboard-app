const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const {User} = require('../models');

module.exports = (passport) => {
  /**
   * Local login strategy.
   * Authenticate with email address and password.
   */
  passport.use('local', new LocalStrategy({
    usernameField: 'emailAddress',
    passwordField: 'password',
    passReqToCallback: true,
  }, (req, emailAddress, password, done) => {
    const providerId = emailAddress;

    // check if email address existed
    User
        .findOne({where: {providerId}})
        .then((user)=>{
          const invalidMessage = 'Invalid email or password';

          // not existed
          if (!user) {
            return done(null, false, req.flash('message', invalidMessage));
          }

          // invalid password
          if (!User.comparePassword(password, user.password)) {
            return done(null, false, req.flash('message', invalidMessage));
          }

          // not verified
          if (user.verified === 0) {
            return done(null, false, req.flash('message', 'NotVerified'));
          }

          return done(null, user);
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
    User
        .findOne({where: {providerId}})
        .then((user)=>{
          // existed, login
          if (user) {
            return done(null, user);
          }

          // not existed, create a new one
          User
              .create({
                providerId,
                provider: 'google',
                emailAddress,
                username,
                verified: 1,
                signUpTimestamp: new Date().toISOString(),
                loginTimes: 0,
              })
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
    User
        .findOne({where: {providerId}})
        .then((user)=>{
          // existed, login
          if (user) {
            return done(null, user);
          }

          // not existed, create a new one
          User
              .create({
                providerId,
                provider: 'facebook',
                emailAddress,
                username,
                verified: 1,
                signUpTimestamp: new Date().toISOString(),
                loginTimes: 0,
              })
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
