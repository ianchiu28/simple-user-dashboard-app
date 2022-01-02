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

  // sign up event
  $('.form-signup').submit((e) => {
    alert('hey');

    const emailAddress = $('#emailAddress').val();
    const username = $('#username').val();
    const password = $('#password').val();
    const repeatPassword = $('#repeatPassword').val();

    $.post('/api/users/' + emailAddress, {
      username,
      password,
    }).done((data) => {
      console.log('done');
      console.log(data);
      window.location.href = '/dashboard';
    }).fail((jqXHR) => {
      const data = jqXHR.responseJSON;
      if (data.status === 'fail') {
        if (data.data.emailAddress === 'EmailAddressTaken') {
          $('#signUpError').text('This email address has been taken.');
        }
      } else {
        $('#signUpError').text(data.message);
      }
      $('#signUpError').removeClass('d-none');
    });

    // avoid to execute the actual submit of the form
    e.preventDefault();
  });
});
