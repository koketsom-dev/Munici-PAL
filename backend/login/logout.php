<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

// Clear all session data
$_SESSION = [];

// Destroy the session
session_destroy();

// Clear the session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

Response::success([], "Logout successful");
