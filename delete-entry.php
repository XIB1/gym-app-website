<?php
ini_set('display_errors', 'on');
error_reporting(E_ALL); 

$id = $_POST["id"];

$valid_token = hash('sha256', $_COOKIE['validationToken']);

$oauth_uid = $_COOKIE['googleAuth'];

// Connect to database and insert the new entry
$conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

// Test connection
if (!$conn) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error connecting to database: " . mysqli_connect_error();
  exit;
}

//validate login token
$result1 = mysqli_query($conn, "
  select 
      email
  from
      users
  where
      oauth_uid = '$oauth_uid'
      and validation_token = '$valid_token'
");

$rowcount = mysqli_num_rows($result1);

if ($rowcount == 0) {
  echo "invalid login token";
  exit;
};

// Delete record
$sql = "
update lifts
set deleted_indicator = 'D', deleted_timestamp = current_timestamp
where lift_id = '$id'
";
if ($conn->query($sql) === TRUE) {
  echo "Record deleted successfully";
}
else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
