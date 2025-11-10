<?php
// backend/bootstrap.php
session_start();

// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: 'db');
define('DB_NAME', getenv('DB_NAME') ?: 'myapp');
define('DB_USER', getenv('DB_USER') ?: 'myuser');
define('DB_PASS', getenv('DB_PASSWORD') ?: 'mypassword');

// Removed JWT token system

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Auto-load required files
require_once __DIR__ . '/utils/Database.php';
require_once __DIR__ . '/utils/response.php';
require_once __DIR__ . '/utils/sanitize.php';

// Set content type to JSON
header('Content-Type: application/json');