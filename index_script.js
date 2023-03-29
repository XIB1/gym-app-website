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
    //ux_mode: 'popup',
    callback: (tokenResponse) => {
        console.log(tokenResponse);
        onSignIn(tokenResponse.access_token);
    },
    });
    client.requestAccessToken();
};