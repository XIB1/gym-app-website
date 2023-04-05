<?php

include "jwt-decode.php";

$valid_token = $_COOKIE['validationToken'];
$user_token = $_GET["user_token"];
$user_data = parseJwt($user_token);

$oauth_uid = $user_data['sub'];

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
      and validation_token = '$valid_token'
");

// Check the result
if (!$result1) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error retrieving entries: " . mysqli_error($conn);
  exit;
};

$rowcount = mysqli_num_rows($result1);

if ($rowcount == 0) {
  echo "invalid";
} else {
  echo "valid";
};

// Close the connection
mysqli_close($conn);

?>