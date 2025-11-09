<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';
require_once '../utils/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
        Response::forbidden("You do not have permission to add employees.");
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $full_name = $input['full_name'] ?? '';
    $phone_number = $input['phone_number'] ?? '';
    $emp_code = $input['emp_code'] ?? '';

    if (empty($email) || empty($password) || empty($full_name)) {
        Response::error("Email, password, and full name are required");
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $query = "INSERT INTO Employee (email, password, first_name, surname, phone_number, emp_code, municipality_id, is_active)
              VALUES (:email, :password, :first_name, :surname, :phone_number, :emp_code, :municipality_id, true)
              RETURNING id";

    // Split full_name into first_name and surname
    $nameParts = explode(' ', $full_name, 2);
    $first_name = $nameParts[0];
    $surname = $nameParts[1] ?? '';

    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':surname', $surname);
    $stmt->bindParam(':phone_number', $phone_number);
    $stmt->bindParam(':emp_code', $emp_code);
    $stmt->bindParam(':municipality_id', $auth['municipality_id']);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    Response::success(['employee_id' => $result['id']], "Employee added successfully");

} catch (Exception $e) {
    error_log("Add employee error: " . $e->getMessage());
    Response::error("Failed to add employee: " . $e->getMessage());
}
