<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';
require_once '../utils/Database.php';

// Allow only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Authenticate the user
try {
    $user = Auth::authenticate();
} catch (Exception $e) {
    Response::unauthorized($e->getMessage());
}

$user_id = $user['user_id'];

// Fetch tickets for the authenticated user (assigned to employee)
try {
    $db = new Database();
    $conn = $db->getConnection();
    $stmt = $conn->prepare("SELECT * FROM Tickets WHERE emp_id = :user_id ORDER BY date_created DESC");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Response::success($tickets, "Your tickets fetched successfully");
} catch (Exception $e) {
    Response::error("Error fetching your tickets: " . $e->getMessage());
}
