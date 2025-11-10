<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error("Method not allowed", 405);
}

try {
    // Authenticate user
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
        Response::error("User not authenticated", 401);
    }
    $userId = $_SESSION['user_id'];
    $userType = $_SESSION['user_type'];

    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);
    $ticketId = $input['ticket_id'] ?? null;

    if (!$ticketId) {
        Response::error("Ticket ID is required");
    }

    $database = new Database();
    $db = $database->connect();

    // Check if ticket exists and user has permission
    $checkQuery = "SELECT user_id, emp_id FROM Tickets WHERE ticket_id = :ticket_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':ticket_id', $ticketId);
    $checkStmt->execute();
    $ticket = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$ticket) {
        Response::error("Ticket not found", 404);
    }

    // Only allow deletion by ticket owner or admin
    if ($userType === 'community_user' && $ticket['user_id'] != $userId) {
        Response::error("You don't have permission to delete this ticket", 403);
    }

    // Delete ticket (cascade will handle related records)
    $deleteQuery = "DELETE FROM Tickets WHERE ticket_id = :ticket_id";
    $deleteStmt = $db->prepare($deleteQuery);
    $deleteStmt->bindParam(':ticket_id', $ticketId);
    $deleteStmt->execute();

    Response::success(['ticket_id' => $ticketId], "Ticket deleted successfully");

} catch (Exception $e) {
    error_log("Delete ticket error: " . $e->getMessage());
    Response::error("Failed to delete ticket: " . $e->getMessage());
}
