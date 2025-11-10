<?php
require_once '../bootstrap.php';
require_once '../utils/Database.php';

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// Check if the user is an admin (access_level should be 'Admin')
$db = new Database();
$conn = $db->getConnection();
$stmt = $conn->prepare("SELECT access_level FROM Employee WHERE id = :user_id");
$stmt->bindParam(':user_id', $user['user_id']);
$stmt->execute();
$employee = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$employee || $employee['access_level'] !== 'Admin') {
    Response::forbidden("You do not have permission to assign tickets.");
}

// Get the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate the request body
if (!isset($data['ticket_id']) || !isset($data['assignee_id'])) {
    Response::error("Ticket ID and assignee ID are required.", 400);
}

$ticket_id = $data['ticket_id'];
$assignee_id = $data['assignee_id'];

// Update the ticket in the database
try {
    $stmt = $conn->prepare("UPDATE Tickets SET emp_id = :assignee_id, last_action_date_time = CURRENT_TIMESTAMP, new_notification = TRUE WHERE ticket_id = :ticket_id");
    $stmt->bindParam(':assignee_id', $assignee_id);
    $stmt->bindParam(':ticket_id', $ticket_id);
    
    if ($stmt->execute()) {
        Response::success([], "Ticket assigned successfully");
    } else {
        Response::error("Error assigning ticket.");
    }
} catch (Exception $e) {
    Response::error("Error assigning ticket: " . $e->getMessage());
}
