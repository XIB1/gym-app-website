<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


require_once 'vendor/autoload.php';

// Start session
session_start();

// Setup the Google API client
$client = new Google\Client();
$client->setApplicationName('Google Login');
$client->setClientId('636033609809-dt5m30p5qurko02s9docsqlnoc6232nb.apps.googleusercontent.com');
$client->setClientSecret('############################');
$client->setRedirectUri('http://localhost:8000');
$client->setScopes(['email', 'profile']);

// If user is not logged in, redirect to Google login page
if (!isset($_SESSION['access_token'])) {
  $auth_url = $client->createAuthUrl();
  header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
  exit;
}

// If user is logged in, get the access token and user profile
if (isset($_SESSION['access_token'])) {
  $client->setAccessToken($_SESSION['access_token']);
  $oauth2 = new Google\Service\Oauth2($client);
  $userInfo = $oauth2->userinfo->get();
  $email = $userInfo->email;
}

// Connect to the database
$host = '34.88.150.1';
$dbname = 'gym-db';
$username = 'app-user';
$password = '983298';

try {
  $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
  exit;
}

// Check if user exists in the database
$stmt = $db->prepare("SELECT id FROM users WHERE email=:email");
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
  // User exists in the database
  $_SESSION['user_id'] = $user['id'];
} else {
  // User does not exist in the database, add user
  $firstName = $userInfo->givenName;
  $lastName = $userInfo->familyName;
  $created = date('Y-m-d H:i:s');
  $modified = date('Y-m-d H:i:s');

  $stmt = $db->prepare("INSERT INTO users (oauth_uid, first_name, last_name, email, created, modified) VALUES (:oauth_uid, :first_name, :last_name, :email, :created, :modified)");
  $stmt->bindValue(':oauth_uid', $userInfo->id, PDO::PARAM_STR);
  $stmt->bindValue(':first_name', $firstName, PDO::PARAM_STR);
  $stmt->bindValue(':last_name', $lastName, PDO::PARAM_STR);
  $stmt->bindValue(':email', $email, PDO::PARAM_STR);
  $stmt->bindValue(':created', $created, PDO::PARAM_STR);
  $stmt->bindValue(':modified', $modified, PDO::PARAM_STR);
  $stmt->execute();

  $_SESSION['user_id'] = $db->lastInsertId();
}

// Redirect to the home page
header('Location: index.php');
exit;
?>