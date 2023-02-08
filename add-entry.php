<?php
  $field1 = $_POST["field1"];
  $field2 = $_POST["field2"];
  $field3 = $_POST["field3"];
  $field4 = $_POST["field4"];
  $field5 = $_POST["field5"];
  $field6 = $_POST["field6"];
  $field7 = $_POST["field7"];
  
  // Connect to database and insert the new entry
  $conn = new mysqli("34.88.150.1", "app-user", "983298", "gym-db");
  $sql = "INSERT INTO table (Date, Time, Exercise, Weight, Sets, Reps, Effort)
          VALUES ('$field1', '$field2', '$field3', '$field4', '$field5', '$field6', '$field7')";
  $conn->query($sql);
  $conn->close();
?>
