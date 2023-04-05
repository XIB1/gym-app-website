function verifyLogin(userToken) {
  var currentDate = new Date();
  var expirationDate = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));
  var xhr = new XMLHttpRequest();
  
  xhr.open('POST', 'verify-login.php');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(xhr.responseText);

      document.cookie = "googleAuth=" + userToken + "; expires=" + expirationDate.toUTCString() + "; path=/";

      if (window.location.href.includes("local")) {
        window.location.href = "http://localhost:8000/gym-app-website/main.html";
      } else {
        window.location.href = "https://gymlog.xyz/main.html";
      };

    }
  };
  xhr.send("user_token=" + userToken);
};

window.onload = function() {


  google.accounts.id.initialize({
    client_id: "636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com",
    callback: (response) => {

      verifyLogin(response.credential);
      
    },
    auto_select: false,
  });
  google.accounts.id.renderButton(
    document.getElementById("button"),
    { theme: "outline", size: "large", shape: "pill", width: 200 }
  );
};