<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

// Perform logout regardless of authentication status
Auth::logout();
Response::success([], "Logout successful");
