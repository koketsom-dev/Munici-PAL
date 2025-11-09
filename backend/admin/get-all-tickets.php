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
