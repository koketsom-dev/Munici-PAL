<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

    $updateFields = [];
    $params = [':user_id' => $userId];

    if (isset($input['full_name'])) {
        $updateFields[] = "full_name = :full_name";
        $params[':full_name'] = $input['full_name'];
    }
    if (isset($input['email'])) {
        $updateFields[] = "email = :email";
        $params[':email'] = $input['email'];
    }
    if (isset($input['gender'])) {
        $updateFields[] = "gender = :gender";
        $params[':gender'] = $input['gender'];
    }
    if (isset($input['home_language'])) {
        $updateFields[] = "home_language = :home_language";
        $params[':home_language'] = $input['home_language'];
    }
    if (isset($input['is_moderator'])) {
        $updateFields[] = "is_moderator = :is_moderator";
        $params[':is_moderator'] = $input['is_moderator'] ? 1 : 0;
    }
    if (isset($input['is_banned'])) {
        $updateFields[] = "is_banned = :is_banned";
        $params[':is_banned'] = $input['is_banned'] ? 1 : 0;
    }

    if (empty($updateFields)) {
        Response::error("No fields to update");
    }

    $query = "UPDATE CommunityUser SET " . implode(', ', $updateFields) . " WHERE id = :user_id";

    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();

    Response::success([], "Community user updated successfully");

} catch (Exception $e) {
    error_log("Update community user error: " . $e->getMessage());
    Response::error("Failed to update user: " . $e->getMessage());
}
