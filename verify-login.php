<?php

require_once 'C:/repos/gym-app-website/vendor/autoload.php';
//require_once '/var/www/html/gym-app-website/vendor/autoload.php';

include 'jwt-decode.php';

$user_token = $_POST["user_token"];

$user_data = parseJwt($user_token);

//$oauth_uid = $user_data['sub'];
$first_name = $user_data['given_name'];
$last_name = $user_data['family_name'];
$email = $user_data['email'];

$CLIENT_ID = '636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com';

//validate login with google client
$client = new Google_Client(['client_id' => $CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
$payload = $client->verifyIdToken($user_token);
if ($payload) {
  $oauth_uid = $payload['sub'];
  echo json_encode($payload);
  // If request specified a G Suite domain:
  //$domain = $payload['hd'];
} else {
  echo 'failed to validate login';
  exit;
  // Invalid ID token
}

// Connect to the database
$conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

// Check the connection
if (!$conn) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error connecting to database: " . mysqli_connect_error();
  exit;
}

// Execute the query to check if user already exists
$result1 = mysqli_query($conn, "
  select 
      email
  from
      users
  where
      oauth_uid = '$oauth_uid'
");

// Check the result
if (!$result1) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error retrieving entries: " . mysqli_error($conn);
  exit;
}

$rowcount = mysqli_num_rows($result1);
$success = 0;

//add new user
if ($rowcount == 0) {

  $sql = "INSERT INTO users (oauth_uid, first_name, last_name, email)
    VALUES ('$oauth_uid', '$first_name', '$last_name', '$email')";

  if ($conn->query($sql) === TRUE) {
    $success = 1;
  } else {
    $success = 0;
  };
};


if (strpos(gethostname(), 'localhost') !== false || $_SERVER['SERVER_ADDR'] == '127.0.0.1') {
  $domain = 'gymlog.xyz';
} else {
  $domain = 'localhost';
};

echo $domain;


if ($rowcount > 0 or $success == 1) {
  // Generate a random token
  $token = bin2hex(random_bytes(16));
  $hashedtoken = hash('sha256', $token);

  // Set the token as a cookie with the HttpOnly and Secure flags
  setcookie('validationToken', $token, [
      'expires' => time() + (60 * 60 * 24 * 14), // 2 weeks expiration
      'path' => '/',
      'domain' => $domain,
      'secure' => true,
      'httponly' => true,
      'samesite' => 'Strict'
  ]);

  setcookie('googleAuth', $oauth_uid, [
    'expires' => time() + (60 * 60 * 24 * 14), // 2 weeks expiration
    'path' => '/',
    'domain' => $domain,
    'secure' => false,
    'httponly' => false,
    'samesite' => 'Strict'
  ]);
  
  $sql = "
    update 
      users 
    set
      validation_token = '$hashedtoken'
    where
      oauth_uid = $oauth_uid
  ";

  if ($conn->query($sql) === TRUE) {
    $success = 1;
  } else {
    $success = 0;
  };

};

// Close the connection
mysqli_close($conn);

?>