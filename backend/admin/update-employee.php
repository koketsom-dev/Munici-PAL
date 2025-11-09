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
        Response::forbidden("You do not have permission to update employees.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $employeeId = $input['employee_id'] ?? null;

    if (!$employeeId) {
        Response::error("Employee ID is required");
    }

    $updateFields = [];
    $params = [':employee_id' => $employeeId];

    if (isset($input['full_name'])) {
        $nameParts = explode(' ', $input['full_name'], 2);
        $updateFields[] = "first_name = :first_name";
        $updateFields[] = "surname = :surname";
        $params[':first_name'] = $nameParts[0];
        $params[':surname'] = $nameParts[1] ?? '';
    }

    if (isset($input['email'])) {
        $updateFields[] = "email = :email";
        $params[':email'] = $input['email'];
    }

    if (isset($input['phone_number'])) {
        $updateFields[] = "phone_number = :phone_number";
        $params[':phone_number'] = $input['phone_number'];
    }

    if (isset($input['emp_code'])) {
        $updateFields[] = "emp_code = :emp_code";
        $params[':emp_code'] = $input['emp_code'];
    }

    if (isset($input['password']) && !empty($input['password'])) {
        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        $updateFields[] = "password = :password";
        $params[':password'] = $hashedPassword;
    }

    if (empty($updateFields)) {
        Response::error("No fields to update");
    }

    $query = "UPDATE Employee SET " . implode(', ', $updateFields) . " WHERE id = :employee_id AND municipality_id = :municipality_id";
    $params[':municipality_id'] = $auth['municipality_id'];

    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();

    Response::success(['employee_id' => $employeeId], "Employee updated successfully");

} catch (Exception $e) {
    error_log("Update employee error: " . $e->getMessage());
    Response::error("Failed to update employee: " . $e->getMessage());
}
