<?php
// backend/index.php - Main Router
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/utils/response.php';

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
        case ($path === '/login' || $path === '/login/login.php') && $method === 'POST':
            require_once __DIR__ . '/login/login.php';
            break;
            
        case ($path === '/register' || $path === '/login/register.php') && $method === 'POST':
            require_once __DIR__ . '/login/register.php';
            break;
            
        case ($path === '/logout' || $path === '/login/logout.php') && $method === 'POST':
            require_once __DIR__ . '/login/logout.php';
            break;
            
        case ($path === '/verify' || $path === '/login/verify.php') && $method === 'GET':
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
        case $path === '/ticket/add-ticket.php' && $method === 'POST':
        case preg_match('#^/ticket/add-ticket#', $path) && $method === 'POST':
            require_once __DIR__ . '/ticket/add-ticket.php';
            break;
            
        case $path === '/ticket/filter-ticket.php' && $method === 'GET':
        case preg_match('#^/ticket/filter-ticket#', $path) && $method === 'GET':
            require_once __DIR__ . '/ticket/filter-ticket.php';
            break;
            
        case $path === '/ticket/update-ticket.php' && $method === 'PUT':
        case preg_match('#^/ticket/update-ticket#', $path) && $method === 'PUT':
            require_once __DIR__ . '/ticket/update-ticket.php';
            break;
            
        case $path === '/ticket/delete-ticket.php' && $method === 'DELETE':
        case preg_match('#^/ticket/delete-ticket#', $path) && $method === 'DELETE':
            require_once __DIR__ . '/ticket/delete-ticket.php';
            break;
            
        case $path === '/ticket/ticket-search.php' && $method === 'GET':
        case preg_match('#^/ticket/ticket-search#', $path) && $method === 'GET':
            require_once __DIR__ . '/ticket/ticket-search.php';
            break;
            
        case $path === '/ticket/sort-ticket.php' && $method === 'GET':
        case preg_match('#^/ticket/sort-ticket#', $path) && $method === 'GET':
            require_once __DIR__ . '/ticket/sort-ticket.php';
            break;
        // <----- TICKET ROUTES END ----->
        
        // <----- DASHBOARD ROUTES START ----->
        case $path === '/api/dashboard/stats.php' && $method === 'GET':
        case preg_match('#^/api/dashboard/stats#', $path) && $method === 'GET':
            require_once __DIR__ . '/api/dashboard/stats.php';
            break;
        // <----- DASHBOARD ROUTES END ----->
        
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