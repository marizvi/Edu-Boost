
var temp1;
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/glogin');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
  console.log('Signed in as: ' + xhr.responseText);
  if(xhr.responseText == 'Stud')
  {
    signOut();
  location.assign("/student");
  }
  if(xhr.responseText == 'Teach')
  {
    signOut();
  location.assign("/teacher");
  }
  if(xhr.responseText == 'Notregistered')
  {
    signOut();
    location.assign("/");
    alert("Not registered...");
  }
  };
  xhr.send(JSON.stringify({token: id_token}));
}
// var x = document.getElementsByClassName('email');
// for(i = 0; i < x.length; i++) {
//   x[i].value = temp1;
// }
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}
function signOut1() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}