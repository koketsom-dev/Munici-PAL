<?php
// backend/index.php - Main Router
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/utils/Response.php';

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path if exists and get clean endpoint
$base_path = '/backend';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Route the request
try {
    switch (true) {
        // <----- AUTHENTICATION ROUTES START ----->
        case $path === '/login' && $method === 'POST':
            require_once __DIR__ . '/login/login.php';
            break;
            
        case $path === '/register' && $method === 'POST':
            require_once __DIR__ . '/login/register.php';
            break;
            
        case $path === '/logout' && $method === 'POST':
            require_once __DIR__ . '/login/logout.php';
            break;
            
        case $path === '/verify' && $method === 'GET':
            require_once __DIR__ . '/login/verify.php';
            break;
        // <----- AUTHENTICATION ROUTES END ----->
        
        // <----- ADMIN ROUTES START ----->
        case $path === '/admin/employees' && $method === 'GET':
            require_once __DIR__ . '/admin/employees.php';
            break;
            
        case $path === '/admin/add-admin' && $method === 'POST':
            require_once __DIR__ . '/admin/add-admin.php';
            break;
            
        case $path === '/admin/delete-admin' && $method === 'DELETE':
            require_once __DIR__ . '/admin/delete-admin.php';
            break;
        // <----- ADMIN ROUTES END ----->
        
        // <----- TICKET ROUTES START ----->
        case $path === '/ticket/create' && $method === 'POST':
            require_once __DIR__ . '/ticket/create.php';
            break;
            
        case $path === '/ticket/list' && $method === 'GET':
            require_once __DIR__ . '/ticket/list.php';
            break;
            
        case $path === '/ticket/update' && $method === 'PUT':
            require_once __DIR__ . '/ticket/update.php';
            break;
        // <----- TICKET ROUTES END ----->
        
        default:
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Endpoint not found'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>