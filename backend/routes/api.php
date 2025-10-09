<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$stmt = $pdo->query("SELECT * FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "data" => $users
]);
