<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $municipalityId = $auth['municipality_id'] ?? 1;

    $database = new Database();
    $db = $database->connect();

    $query = "SELECT id, full_name, email, gender, home_language, registration_date, is_moderator, is_banned
              FROM CommunityUser
              WHERE municipality_id = :municipality_id
              ORDER BY registration_date DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId, PDO::PARAM_INT);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success($users, "Community users retrieved successfully");

} catch (Exception $e) {
    error_log("Get community users error: " . $e->getMessage());
    Response::error("Failed to retrieve users: " . $e->getMessage());
}
