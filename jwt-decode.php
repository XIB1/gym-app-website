<?php

function parseJwt($token) {
  $base64Url = explode('.', $token)[1];
  $base64 = str_replace(['-', '_'], ['+', '/'], $base64Url);
  $jsonPayload = urldecode(base64_decode($base64));

  return json_decode($jsonPayload, true);
}

?>
