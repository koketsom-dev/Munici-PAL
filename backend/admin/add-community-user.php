<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $municipalityId = $auth['municipality_id'] ?? 1;

    $input = json_decode(file_get_contents('php://input'), true);
    $fullName = $input['full_name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $gender = $input['gender'] ?? 'Other';
    $homeLanguage = $input['home_language'] ?? 'Other';

    if (empty($fullName) || empty($email) || empty($password)) {
        Response::error("Full name, email, and password are required");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error("Invalid email format");
    }

    $database = new Database();
    $db = $database->connect();

    // Check if email already exists
    $checkQuery = "SELECT id FROM CommunityUser WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->fetch()) {
        Response::error("Email already exists");
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $query = "INSERT INTO CommunityUser (municipality_id, full_name, email, password, gender, home_language)
              VALUES (:municipality_id, :full_name, :email, :password, :gender, :home_language)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId, PDO::PARAM_INT);
    $stmt->bindParam(':full_name', $fullName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':home_language', $homeLanguage);
    $stmt->execute();

    $userId = $db->lastInsertId();

    Response::success(['id' => $userId], "Community user added successfully");

} catch (Exception $e) {
    error_log("Add community user error: " . $e->getMessage());
    Response::error("Failed to add user: " . $e->getMessage());
}
