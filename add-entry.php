<?php
  
include "jwt-decode.php";

ini_set('display_errors', 'on');
error_reporting(E_ALL); 

$field1 = $_POST["field1"];
$field2 = $_POST["field2"];
$field3 = $_POST["field3"];
$field4 = $_POST["field4"];
$field5 = $_POST["field5"];
$field6 = $_POST["field6"];
$field7 = $_POST["field7"];
$user_token = $_POST["user_token"];

$user_data = parseJwt($user_token);

$oauth_uid = $user_data['sub'];

// Connect to database and insert the new entry
$conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

if (!$conn) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error connecting to database: " . mysqli_connect_error();
  exit;
}

$sql = "INSERT INTO lifts (Date, Time, exe_id, Weight, Sets, Reps, Effort, user_id)
        VALUES ('$field1', '$field2', (select exe_id from exercise where exercise = '$field3'), '$field4', '$field5', '$field6', '$field7', (select id from users where oauth_uid = '$oauth_uid'))";
if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
}
else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
