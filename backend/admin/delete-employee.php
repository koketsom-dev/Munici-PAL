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
        Response::forbidden("You do not have permission to delete employees.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $employeeId = $input['employee_id'] ?? null;

    if (!$employeeId) {
        Response::error("Employee ID is required");
    }

    $query = "DELETE FROM Employee WHERE id = :employee_id AND municipality_id = :municipality_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':employee_id', $employeeId);
    $stmt->bindParam(':municipality_id', $auth['municipality_id']);
    $stmt->execute();

    Response::success(['employee_id' => $employeeId], "Employee deleted successfully");

} catch (Exception $e) {
    error_log("Delete employee error: " . $e->getMessage());
    Response::error("Failed to delete employee: " . $e->getMessage());
}
