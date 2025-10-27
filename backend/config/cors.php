<?php
// Enable CORS
$allowed_origins = ALLOWED_ORIGINS;
$request_origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($request_origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $request_origin);
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>