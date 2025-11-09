<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';
require_once '../utils/Database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
        Response::forbidden("You do not have permission to view admins.");
    }

    $query = "SELECT id, first_name, surname, email, emp_job_title, is_active 
              FROM Employee 
              WHERE municipality_id = :municipality_id 
              ORDER BY first_name ASC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $auth['municipality_id']);
    $stmt->execute();

    $admins = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $admins[] = [
            'id' => $row['id'],
            'first_name' => $row['first_name'],
            'surname' => $row['surname'],
            'email' => $row['email'],
            'job_title' => $row['emp_job_title'],
            'is_active' => (bool)$row['is_active']
        ];
    }

    Response::success($admins, "Admins retrieved successfully");

} catch (Exception $e) {
    error_log("Manage admin error: " . $e->getMessage());
    Response::error("Failed to retrieve admins: " . $e->getMessage());
}