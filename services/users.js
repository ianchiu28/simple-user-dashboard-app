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
