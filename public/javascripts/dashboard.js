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
  $.ajax({
    url: '/api/users/current',
    type: 'PUT',
    data: {
      newUsername,
    },
  }).done(() => {
    getUserInfo();
  }).fail((jqXHR) => {
    if (jqXHR.status === 401) {
      $('#modalUnauthorized').modal('show');
    } else if (jqXHR.status === 503) {
      $('#modalSomethingWrong').modal('show');
    }
  }).always(() => {
    $('#modalEditUsername').modal('hide');
  });
}

$(() => {
  // icons
  // feather.replace();

  // get user name and email
  getUserInfo();

  // Edit user name save button click event
  $('#btnEditUsernameSave').click(modalEditUsernameSave);
});
