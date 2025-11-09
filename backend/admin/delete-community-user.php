<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();

    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $input['user_id'] ?? null;

    if (!$userId) {
        Response::error("User ID is required");
    }

    $database = new Database();
    $db = $database->connect();

    $query = "DELETE FROM CommunityUser WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    Response::success([], "Community user deleted successfully");

} catch (Exception $e) {
    error_log("Delete community user error: " . $e->getMessage());
    Response::error("Failed to delete user: " . $e->getMessage());
}
