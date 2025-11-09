<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';

    if (empty($email)) {
        Response::error("Email is required");
    }

    $database = new Database();
    $db = $database->connect();

    $table = '';
    $query = "SELECT id, email FROM employee WHERE email = :email AND is_active = true";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        $query = "SELECT id, email FROM communityuser WHERE email = :email AND is_banned = false";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $table = 'communityuser';
    } else {
        $table = 'employee';
    }

    if (!$user) {
        Response::error("Email not found", 404);
    }

    $resetToken = bin2hex(random_bytes(32));
    $tokenExpiry = date('Y-m-d H:i:s', time() + 3600);

    $updateQuery = "UPDATE $table SET reset_token = :token, reset_token_expiry = :expiry WHERE id = :id";
    $updateStmt = $db->prepare($updateQuery);
    $updateStmt->bindParam(':token', $resetToken);
    $updateStmt->bindParam(':expiry', $tokenExpiry);
    $updateStmt->bindParam(':id', $user['id']);
    $updateStmt->execute();

    Response::success([
        'message' => 'Password reset email sent',
        'reset_token' => $resetToken
    ], "Check your email for password reset instructions");

} catch (Exception $e) {
    error_log("Reset password error: " . $e->getMessage());
    Response::error("Failed to process password reset: " . $e->getMessage());
}