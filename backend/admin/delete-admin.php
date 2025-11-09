<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';
require_once '../utils/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    
    $database = new Database();
    $db = $database->connect();
    
    $stmt = $db->prepare("SELECT access_level FROM Employee WHERE id = :user_id");
    $stmt->bindParam(':user_id', $auth['user_id']);
    $stmt->execute();
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$employee || $employee['access_level'] !== 'Admin') {
        Response::forbidden("You do not have permission to delete admins.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $adminId = $input['admin_id'] ?? null;

    if (!$adminId) {
        Response::error("Admin ID is required");
    }

    $query = "DELETE FROM Employee WHERE id = :admin_id AND municipality_id = :municipality_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':admin_id', $adminId);
    $stmt->bindParam(':municipality_id', $auth['municipality_id']);
    $stmt->execute();

    Response::success(['admin_id' => $adminId], "Admin deleted successfully");

} catch (Exception $e) {
    error_log("Delete admin error: " . $e->getMessage());
    Response::error("Failed to delete admin: " . $e->getMessage());
}