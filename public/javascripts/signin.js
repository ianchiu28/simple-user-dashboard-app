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
  // Sign in page event registeration
  $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
  $('#logreg-forms #cancel_reset').click(toggleResetPswd);
  $('#logreg-forms #btn-signup').click(toggleSignUp);
  $('#logreg-forms #cancel_signup').click(toggleSignUp);
});
