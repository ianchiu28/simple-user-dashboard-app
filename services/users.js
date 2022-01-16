const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {User} = require('../models');

// gmail server setting
const mailTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN,
  },
});

/**
 * Validate email address
 * @param {string} email
 * @return {boolean} valid emaill address or not
 */
exports.validateEmail = (email) => {
  const reg = new RegExp([
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|',
    '(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|',
    '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
  ].join(''));
  return reg.test(email);
};

/**
 * Validate password
 * @param {string} password
 * @return {boolean} valid password or not
 */
exports.validatePassword = (password) => {
  const reg = new RegExp([
    '^(?=.*\\d)',
    '(?=.*[a-z])',
    '(?=.*[A-Z])',
    '(?=.*[!"#$%&\'()*+,\\-.\\/:;<=>?@[\\\\\\]^_`{|}~])',
    '.{8,}$',
  ].join(''));
  return reg.test(password);
};

/**
 * Validate username
 * @param {string} username
 * @return {boolean} valid username or not
 */
exports.validateUsername = (username) => {
  return typeof username === 'string';
};

/**
 * Send mail to recipient
 * @param {string} recipient
 * @param {string} verifiedToken
 * @return {Promise<sendMail>} send mail async function
 */
exports.sendMail = (recipient, verifiedToken) => {
  return new Promise((resolve, reject) => {
    mailTransport.sendMail({
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: 'Welcome to Simple User Dashboard App!',
      html: `<h4>Hello,</h4><br><br>
        <h4>To finish setting up this account,
        please click on the link below:</h4><br>
        https://simple-user-dashboard-app.herokuapp.com/api/users/verify?token=${verifiedToken}<br><br>
        <h4>Best Regards,</h4><br>
        <h4>Simple User Dashboard App</h4>
      `,
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Update user session timestamp
 * @param {Object} user User model
 * @return {Promise<updateUser>} update session timestamp async function
 */
exports.updateSessionTimestamp = (user) => {
  return User.update({
    sessionTimestamp: new Date().toISOString(),
  }, {
    where: {providerId: user.providerId},
  });
};

/**
 * Get user by provider id
 * @param {string} providerId
 * @return {Promise<getUser>} get user async function
 */
exports.getUser = (providerId) => {
  return User.findOne({where: {providerId}});
};

/**
 * Generate a verified token
 * @return {string} verified token
 */
exports.generateVerifiedToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * Create a new user
 * @param {string} emailAddress
 * @param {string} password
 * @param {string} username
 * @param {string} verifiedToken
 * @return {Promise<createUser>} create user async function
 */
exports.createUser = (emailAddress, password, username, verifiedToken) => {
  return User.create({
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
};
