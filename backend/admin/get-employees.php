<?php
require_once '../bootstrap.php';
require_once '../utils/Database.php';

// Allow only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Authenticate the user
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
    Response::unauthorized("User not authenticated");
}

$user = [
    'user_id' => $_SESSION['user_id'],
    'user_type' => $_SESSION['user_type'],
    'municipality_id' => $_SESSION['municipality_id'] ?? 1
];

// For now, allow all authenticated users to access this endpoint
// TODO: Implement proper admin role checking when user management is complete

// Fetch all employees from the database
try {
    $db = new Database();
    $conn = $db->getConnection();
    $stmt = $conn->prepare("SELECT id, first_name, surname, email, phone_number, emp_code, emp_job_title, access_level FROM Employee ORDER BY surname, first_name");
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Response::success($employees, "Employees fetched successfully");
} catch (Exception $e) {
    Response::error("Error fetching employees: " . $e->getMessage());
}
