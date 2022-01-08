/**
 * Toggle reset password page
 * @param {object} e jQuery event object
 */
function toggleResetPswd(e) {
  e.preventDefault();
  $('#logreg-forms .form-signin').toggle();
  $('#logreg-forms .form-reset').toggle();
}

/**
 * Toggle sign up page
 * @param {object} e jQuery event object
 */
function toggleSignUp(e) {
  e.preventDefault();
  $('#logreg-forms .form-signin').toggle();
  $('#logreg-forms .form-signup').toggle();
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
  const password = $('#password').val();
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
  const password = $('#password').val();
  const confirmPassword = $('#confirmPassword').val();
  if (password === confirmPassword) {
    $('#confirmPasswordError').hide();
  } else {
    $('#confirmPasswordError').show();
  }
}

/**
 * Sign up submit button event
 * @param {object} e jQuery event object
 */
function signUpSubmit(e) {
  // avoid to execute the actual submit of the form
  e.preventDefault();

  const emailAddress = $('#emailAddress').val();
  const username = $('#username').val();
  const password = $('#password').val();
  const confirmPassword = $('#confirmPassword').val();

  // validate password
  if (!validatePasswordRegexp(password)) {
    return;
  }

  // password and confirm password do not match
  if (password !== confirmPassword) {
    return;
  }

  // disable and loading
  $('#btnSignup').prop('disabled', true);
  $('.loading').show();

  // call sign up API
  $.ajax({
    url: '/api/users/' + emailAddress,
    type: 'POST',
    data: {
      username,
      password,
    },
  }).done(() => {
    // success
    $('#modalSignUpSuccess').modal('show');
  }).fail((jqXHR) => {
    // fail or error, show error message
    const data = jqXHR.responseJSON;
    if (data.status === 'fail') {
      if (data.data.emailAddress === 'EmailAddressTaken') {
        $('#signUpError').text('This email address has been taken.');
      }
    } else {
      $('#signUpError').text(data.message);
    }
    $('#signUpError').show();
  }).always(() => {
    // reset
    $('#btnSignup').prop('disabled', false);
    $('.loading').hide();
  });
}

/**
 * Sign in submit button event
 * @param {object} e jQuery event object
 */
 function signInSubmit(e) {
  // avoid to execute the actual submit of the form
  e.preventDefault();

  const emailAddress = $('#inputEmail').val();
  const password = $('#inputPassword').val();

  // disable and loading
  $('#btnSignin').prop('disabled', true);
  $('.loading').show();
  $('#signInError').hide();

  // call sign up API
  $.ajax({
    url: '/auth/local',
    type: 'POST',
    data: {
      emailAddress,
      password,
    },
  }).done(() => {
    // success
    window.location.href = '/dashboard';
  }).fail((jqXHR) => {
    // fail or error, show error message
    if (jqXHR.status === 400) {
      const message = jqXHR.responseJSON.data.auth;
      if (message === 'InvalidEmailAddress' || message === 'InvalidPassword') {
        $('#signInError').show();
      } else if (message === 'NotVerified') {
        $('#modalNotVerified').modal('show');
      }
    } else if (jqXHR.status === 503) {
      $('#modalSomethingWrong').modal('show');
    }

    // fail or error, show error message
    const data = jqXHR.responseJSON;
    if (data.status === 'fail') {
      if (data.data.emailAddress === 'EmailAddressTaken') {
        $('#signUpError').text('This email address has been taken.');
      }
    } else {
      $('#signUpError').text(data.message);
    }
    $('#signUpError').show();
  }).always(() => {
    // reset
    $('#btnSignin').prop('disabled', false);
    $('.loading').hide();
  });
}

$(()=>{
  // toggle reset password page
  $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
  $('#logreg-forms #cancel_reset').click(toggleResetPswd);

  // toggle sign up page
  $('#logreg-forms #btn-signup').click(toggleSignUp);
  $('#logreg-forms #cancel_signup').click(toggleSignUp);

  // facebook auth
  $('.facebook-btn').click(() => {
    window.location.href = '/auth/facebook';
    return false;
  });

  // google auth
  $('.google-btn').click(() => {
    window.location.href = '/auth/google';
    return false;
  });

  // initialize
  $('.loading').hide();
  $('#passwordError').hide();
  $('#confirmPasswordError').hide();
  $('#signUpError').hide();
  $('#signInError').hide();
  $('#password').on('input', togglePasswordError);
  $('#password').on('input', toggleConfirmPasswordError);
  $('#confirmPassword').on('input', toggleConfirmPasswordError);

  // sign up submit button event
  $('.form-signup').submit(signUpSubmit);

  // sign in submit button event
  $('.form-signin').submit(signInSubmit);
});
