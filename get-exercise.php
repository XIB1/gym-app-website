<?php

// Connect to the database
$conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

//var_dump($conn)

// Check the connection
if (!$conn) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error connecting to database: " . mysqli_connect_error();
  exit;
}

// Execute the query to retrieve the entries from the database
//$result = mysqli_query($conn, "SELECT Date, Time, Exercise, Weight, Sets, Reps, Effort FROM lifts");
$result = mysqli_query($conn, "
  select 
    exercise
  from
    exercise
  order by
    exercise
");

// Check the result
if (!$result) {
  header("HTTP/1.1 500 Internal Server Error");
  echo "Error retrieving entries: " . mysqli_error($conn);
  exit;
}

// Fetch the entries from the result set
$entries = array();
while ($row = mysqli_fetch_assoc($result)) {
  $entries[] = $row;
}

// Close the connection
mysqli_close($conn);

// Return the entries as a JSON-encoded string
header("Content-Type: application/json");
echo json_encode($entries);

?>
