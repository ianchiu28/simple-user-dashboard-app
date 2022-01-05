/**
 * Get user information and put them on user profile.
 */
function getUserInfo() {
  $.get('/api/users/current').done((data) => {
    // success, return user info
    $('#profileUsername').text('User name: ' + data.data.username);
    $('#profileEmail').text('Email address: '+ data.data.emailAddress);
  }).fail((jqXHR) => {
    // fail or error, show error message
    if (jqXHR.status === 401) {
      alert('Unauthorized! Please sign in again.');
    }
  });
}

$(() => {
  // feather.replace();

  // get user name and email
  getUserInfo();
});
