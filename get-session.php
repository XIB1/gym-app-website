<?php

include "jwt-decode.php";

//get current users oauth_uid
$user_token = $_GET["user_token"];
$user_data = parseJwt($user_token);
$oauth_uid = $user_data['sub'];

$date = $_GET["date"];

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
    substr(time, 1,5) as time,
    exercise,
    weight,
    sets,
    reps,
    effort,
    lift_id
from
    lifts l
left join
    exercise e on l.exe_id = e.exe_id
where
    date = '" . $date . "'
    and deleted_indicator is null
    and user_id = (select id from users where oauth_uid = '$oauth_uid')
order by 
    time desc
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
