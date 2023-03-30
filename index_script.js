//import  { jwtdecode } from "./node_modules/jwt-decode/build/jwt-decode.js";


function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}



/*
function onSignIn(id_token) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'verify-login.php');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };
    xhr.send('id_token=' + id_token);
};

function sign2() {
    console.log("test1");

    const client = google.accounts.oauth2.initTokenClient({
    client_id: '636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
    callback: (tokenResponse) => {
        console.log(tokenResponse);
        onSignIn(tokenResponse.access_token);
    },
    });
    client.requestAccessToken();
};
*/
window.onload = function() {
  var currentDate = new Date();
  var expirationDate = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));

  google.accounts.id.initialize({
    client_id: "636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com",
    callback: (response) => {
      console.log(parseJwt(response.credential));
      document.cookie = "googleAuth=" + response.credential + "; expires=" + expirationDate.toUTCString() + "; path=/";
    },
    auto_select: false,
  });
  google.accounts.id.renderButton(
    document.getElementById("button"),
    { theme: "outline", size: "large" }
  );
};