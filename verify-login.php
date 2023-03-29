<?php
require_once 'C:/repos/gym-app-website/vendor/autoload.php'; // include the Google API PHP client library

// set up the client object
$client = new Google_Client(['client_id' => '636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com']);
$client->setApplicationName('gymlog.xyz');
$client->setAccessType('offline');
$client->setApprovalPrompt('auto');
$client->setScopes(['email']);

// verify the id_token
$id_token = $_POST['id_token'];
$payload = $client->verifyIdToken($id_token);
if ($payload) {
  // the id_token is valid
  $user_id = $payload['sub'];
  // use $user_id to authenticate the user on your server
} else {
  // the id_token is invalid
  http_response_code(401);
  die('Invalid id_token');
}
?>