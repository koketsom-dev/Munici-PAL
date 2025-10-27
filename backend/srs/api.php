<?php
$host = getenv("DB_HOST");
$port = getenv("DB_PORT");
$dbname = getenv("DB_NAME");
$user = getenv("DB_USER");
$password = getenv("DB_PASSWORD");

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";
    $pdo = new PDO($dsn, $user, $password);
    echo "Connected to Postgres with PostGIS successfully!";
} catch (PDOException $e) {
    echo "DB Connection failed: " . $e->getMessage();
}
