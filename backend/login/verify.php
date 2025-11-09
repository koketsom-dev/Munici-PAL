<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    
    Response::success([
        'user_id' => $auth['user_id'],
        'user_type' => $auth['user_type'],
        'email' => $auth['email'],
        'municipality_id' => $auth['municipality_id'],
        'verified' => true
    ], "Authentication successful");
    
} catch (Exception $e) {
    Response::unauthorized("Authentication failed");
}
