<?php

// Connect to the database
$conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

$oauth_uid = $_POST["oauth_uid"];
$first_name = $_POST["first_name"];
$last_name = $_POST["last_name"];
$email = $_POST["email"];

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

//add new user
if ($rowcount == 0) {

  $sql = "INSERT INTO users (oauth_uid, first_name, last_name, email)
    VALUES ('$oauth_uid', '$first_name', '$last_name', '$email')";

  if ($conn->query($sql) === TRUE) {
    echo "New user added successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

} else {
  echo "User already exists";
};

// Close the connection
mysqli_close($conn);

?>