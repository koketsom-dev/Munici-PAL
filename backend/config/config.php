<?php
// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'db');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'myapp');
define('DB_USER', getenv('DB_USER') ?: 'myuser');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: 'mypassword');

// Application Configuration
define('APP_DEBUG', true);
define('APP_URL', 'http://localhost:8000');
define('APP_TIMEZONE', 'UTC');

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002'
]);

// Security Configuration - JWT removed

// Logging Configuration
define('LOG_PATH', __DIR__ . '/../logs/');
?>