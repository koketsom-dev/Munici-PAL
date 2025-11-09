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
        Response::forbidden("You do not have permission to add admins.");
    }

    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $first_name = $input['first_name'] ?? '';
    $surname = $input['surname'] ?? '';
    
    if (empty($email) || empty($password) || empty($first_name) || empty($surname)) {
        Response::error("Email, password, first name and surname are required");
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $query = "INSERT INTO Employee (email, password, first_name, surname, municipality_id, is_active)
              VALUES (:email, :password, :first_name, :surname, :municipality_id, true)
              RETURNING id";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':surname', $surname);
    $stmt->bindParam(':municipality_id', $auth['municipality_id']);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    Response::success(['admin_id' => $result['id']], "Admin added successfully");
    
} catch (Exception $e) {
    error_log("Add admin error: " . $e->getMessage());
    Response::error("Failed to add admin: " . $e->getMessage());
}