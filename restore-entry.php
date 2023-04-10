<?php

include "jwt-decode.php";
ini_set('display_errors', 'on');
error_reporting(E_ALL); 

$id = $_POST["id"];
//$user_token = $_POST["user_token"];
//$user_data = parseJwt($user_token);
//$oauth_uid = $user_data['sub'];

$valid_token = hash('sha256', $_COOKIE['validationToken']);

$oauth_uid = $_COOKIE['googleAuth'];

// Connect to database and insert the new entry
$conn = mysqli_connect("34.88.150.1", "app-user", "983298", "gym-db");

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

// Restore entry
$sql = "
update 
  lifts
set 
  deleted_indicator = null, 
  deleted_timestamp = null
where 
  deleted_timestamp = (
    select
      t 
    from (
      select max(deleted_timestamp) as t 
      from lifts 
      where user_id = (select id from users where oauth_uid = '$oauth_uid')
    ) as a
  )
  and user_id = (select id from users where oauth_uid = '$oauth_uid')
";

if ($conn->query($sql) === TRUE) {
  echo "Record restored successfully";
}
else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();

?>
