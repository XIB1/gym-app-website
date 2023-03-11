<?php
  ini_set('display_errors', 'on');
  error_reporting(E_ALL); 
  
  $field1 = $_POST["field1"];
  $field2 = $_POST["field2"];
  $field3 = $_POST["field3"];
  $field4 = $_POST["field4"];
  $field5 = $_POST["field5"];
  $field6 = $_POST["field6"];
  $field7 = $_POST["field7"];
  
  /*
  $field1 = "2022-02-19";
  $field2 = "0";
  $field3 = "Test";
  $field4 = "0";
  $field5 = "0";
  $field6 = "0";
  $field7 = "0";
  */
  // Connect to database and insert the new entry
  $conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

  if (!$conn) {
    header("HTTP/1.1 500 Internal Server Error");
    echo "Error connecting to database: " . mysqli_connect_error();
    exit;
  }

  $sql = "INSERT INTO lifts (Date, Time, exeid, Weight, Sets, Reps, Effort)
          VALUES ('$field1', '$field2', (select exeid from exercise where exercise = '$field3'), '$field4', '$field5', '$field6', '$field7')";
  if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
  }
  else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();
?>
