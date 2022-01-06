/**
 * Get user information and put them on user profile.
 */
function getUserInfo() {
  $.ajax({
    url: '/api/users/current',
    type: 'GET',
  }).done((data) => {
    // success, return user info
    $('#profileUsername').text('User name: ' + data.data.username);
    $('#profileEmail').text('Email address: '+ data.data.emailAddress);
  }).fail((jqXHR) => {
    // fail or error, show error message
    if (jqXHR.status === 401) {
      $('#modalUnauthorized').modal('show');
    }
  });
}

/**
 * Click event for save button in modal Edit user name
 */
function modalEditUsernameSave() {
  const newUsername = $('#inputEditUsernameValue').val().toString();

  // must input something
  if (newUsername.length === 0) {
    return;
  }

  // disable and loading
  $('#btnEditUsernameSave').prop('disabled', true);
  $('.loading').show();

  // call API
  $.ajax({
    url: '/api/users/current',
    type: 'PUT',
    data: {
      newUsername,
    },
  }).done(() => {
    // success, update user info
    getUserInfo();
  }).fail((jqXHR) => {
    // fail or error, show error message
    if (jqXHR.status === 401) {
      $('#modalUnauthorized').modal('show');
    } else if (jqXHR.status === 503) {
      $('#modalSomethingWrong').modal('show');
    }
  }).always(() => {
    // reset
    $('#btnEditUsernameSave').prop('disabled', false);
    $('.loading').hide();
    $('#inputEditUsernameValue').val('');

    // show user profile
    $('#modalEditUsername').modal('hide');
  });
}

/**
 * Validate password by reg exp
 * @param {string} password
 * @return {boolean} valid password or not
 */
function validatePasswordRegexp(password) {
  const reg = new RegExp([
    '^(?=.*\\d)',
    '(?=.*[a-z])',
    '(?=.*[A-Z])',
    '(?=.*[!"#$%&\'()*+,\\-.\\/:;<=>?@[\\\\\\]^_`{|}~])',
    '.{8,}$',
  ].join(''));
  return reg.test(password);
}

/**
 * Toggle password error message
 */
function togglePasswordError() {
  const password = $('#inputNewPassword').val();
  if (validatePasswordRegexp(password)) {
    $('#passwordError').hide();
  } else {
    $('#passwordError').show();
  }
}

/**
 * Toggle confirm password error message
 */
function toggleConfirmPasswordError() {
  const password = $('#inputNewPassword').val();
  const confirmPassword = $('#inputNewPasswordConfirm').val();
  if (password === confirmPassword) {
    $('#confirmPasswordError').hide();
  } else {
    $('#confirmPasswordError').show();
  }
}

/**
 * Click event for save button in modal reset password
 */
function modalResetPasswordSave() {
  const oldPassword = $('#inputOldPassword').val();
  const newPassword = $('#inputNewPassword').val();
  const confirmPassword = $('#inputNewPasswordConfirm').val();

  // validate password
  if (!validatePasswordRegexp(newPassword)) {
    return;
  }

  // password and confirm password do not match
  if (newPassword !== confirmPassword) {
    return;
  }

  // disable and loading
  $('#btnEditUsernameSave').prop('disabled', true);
  $('.loading').show();

  // call API
  // $.ajax({
  //   url: '/api/users/current',
  //   type: 'PUT',
  //   data: {
  //     newUsername,
  //   },
  // }).done(() => {
  //   // success, update user info
  //   getUserInfo();
  // }).fail((jqXHR) => {
  //   // fail or error, show error message
  //   if (jqXHR.status === 401) {
  //     $('#modalUnauthorized').modal('show');
  //   } else if (jqXHR.status === 503) {
  //     $('#modalSomethingWrong').modal('show');
  //   }
  // }).always(() => {
  //   // reset
  //   $('#btnEditUsernameSave').prop('disabled', false);
  //   $('.loading').hide();
  //   $('#inputEditUsernameValue').val('');

  //   // show user profile
  //   $('#modalEditUsername').modal('hide');
  // });
}

$(() => {
  // icons
  // feather.replace();

  // hide all loading spinner
  $('.loading').hide();

  // get user name and email
  getUserInfo();

  // Edit user name save button click event
  $('#btnEditUsernameSave').click(modalEditUsernameSave);

  // reset password initialize
  $('#passwordError').hide();
  $('#confirmPasswordError').hide();
  $('#inputNewPassword').on('input', togglePasswordError);
  $('#inputNewPassword').on('input', toggleConfirmPasswordError);
  $('#inputNewPasswordConfirm').on('input', toggleConfirmPasswordError);
  $('#btnResetPasswordSave').click(modalResetPasswordSave);
});
