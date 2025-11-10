<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Check if user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
    Response::error("User not authenticated", 401);
}

Response::success([
    'user_id' => $_SESSION['user_id'],
    'user_type' => $_SESSION['user_type'],
    'email' => $_SESSION['email'] ?? '',
    'municipality_id' => $_SESSION['municipality_id'] ?? 1,
    'verified' => true
], "Authentication successful");
