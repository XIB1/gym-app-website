<?php
  ini_set('display_errors', 'on');
  error_reporting(E_ALL); 
  
  $id = $_POST["id"];
  
  // Connect to database and insert the new entry
  $conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

  if (!$conn) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error connecting to database: " . mysqli_connect_error();
    exit;
  }

  $sql = "delete from lifts where lift_id = '$id'";
  if ($conn->query($sql) === TRUE) {
    echo "Record deleted successfully";
  }
  else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();
?>
