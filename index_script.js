function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

function verifyLogin(userData) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'verify-login.php');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };

  var oauth_uid = encodeURIComponent(userData.sub);
  var first_name =  encodeURIComponent(userData.given_name);
  var last_name = encodeURIComponent(userData.family_name);
  var email = encodeURIComponent(userData.email);

  xhr.send(
    "oauth_uid=" + oauth_uid + 
    "&first_name=" + first_name + 
    "&last_name=" + last_name + 
    "&email=" + email
  );
};

window.onload = function() {
  var currentDate = new Date();
  var expirationDate = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));

  google.accounts.id.initialize({
    client_id: "636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com",
    callback: (response) => {
      console.log(parseJwt(response.credential));

      const userData = parseJwt(response.credential);

      verifyLogin(userData);

      document.cookie = "googleAuth=" + response.credential + "; expires=" + expirationDate.toUTCString() + "; path=/";

      
      if (window.location.href.includes("local")) {
        window.location.href = "http://localhost:8000/gym-app-website/main.html"
      } else {
        window.location.href = "https://gymlog.xyz/main.html"
      };
      
    },
    auto_select: false,
  });
  google.accounts.id.renderButton(
    document.getElementById("button"),
    { theme: "outline", size: "large", shape: "pill", width: 20 }
  );
};