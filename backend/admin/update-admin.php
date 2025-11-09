<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';
require_once '../utils/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
        Response::forbidden("You do not have permission to update admins.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $adminId = $input['admin_id'] ?? null;

    if (!$adminId) {
        Response::error("Admin ID is required");
    }

    $updateFields = [];
    $params = [':admin_id' => $adminId];

    if (isset($input['first_name'])) {
        $updateFields[] = "first_name = :first_name";
        $params[':first_name'] = $input['first_name'];
    }

    if (isset($input['surname'])) {
        $updateFields[] = "surname = :surname";
        $params[':surname'] = $input['surname'];
    }

    if (isset($input['email'])) {
        $updateFields[] = "email = :email";
        $params[':email'] = $input['email'];
    }

    if (isset($input['job_title'])) {
        $updateFields[] = "emp_job_title = :job_title";
        $params[':job_title'] = $input['job_title'];
    }

    if (empty($updateFields)) {
        Response::error("No fields to update");
    }

    $query = "UPDATE Employee SET " . implode(', ', $updateFields) . " WHERE id = :admin_id AND municipality_id = :municipality_id";
    $params[':municipality_id'] = $auth['municipality_id'];
    
    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();

    Response::success(['admin_id' => $adminId], "Admin updated successfully");

} catch (Exception $e) {
    error_log("Update admin error: " . $e->getMessage());
    Response::error("Failed to update admin: " . $e->getMessage());
}