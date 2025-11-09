<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();

    $input = json_decode(file_get_contents('php://input'), true);
    $currentPassword = $input['current_password'] ?? '';
    $newPassword = $input['new_password'] ?? '';

    if (empty($currentPassword) || empty($newPassword)) {
        Response::error("Current password and new password are required");
    }

    $database = new Database();
    $db = $database->connect();

    if ($auth['user_type'] === 'employee') {
        $query = "SELECT password FROM Employee WHERE id = :id";
    } else {
        $query = "SELECT password FROM CommunityUser WHERE id = :id";
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $auth['user_id']);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($currentPassword, $user['password'])) {
        Response::error("Current password is incorrect", 401);
    }

    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $table = $auth['user_type'] === 'employee' ? 'Employee' : 'CommunityUser';
    
    $updateQuery = "UPDATE $table SET password = :password WHERE id = :id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':password', $newPasswordHash);
    $updateStmt->bindParam(':id', $auth['user_id']);
    $updateStmt->execute();

    Response::success([], "Password updated successfully");

} catch (Exception $e) {
    error_log("Update password error: " . $e->getMessage());
    Response::error("Failed to update password: " . $e->getMessage());
}