<?php
require_once '../bootstrap.php';
require_once '../utils/Database.php';

// Allow only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Authenticate the user
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

try {
    $db = new Database();
    $conn = $db->getConnection();

    // Fetch all tickets from the database
    $stmt = $conn->prepare("SELECT * FROM Tickets ORDER BY date_created DESC");
    $stmt->execute();
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Response::success($tickets, "Tickets fetched successfully");
} catch (Exception $e) {
    Response::error("Error fetching tickets: " . $e->getMessage());
}
