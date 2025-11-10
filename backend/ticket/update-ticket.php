<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

    $checkQuery = "SELECT user_id, emp_id, municipality_id, status, subject, description, issue_type FROM Tickets WHERE ticket_id = :ticket_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':ticket_id', $ticketId);
    $checkStmt->execute();
    $ticket = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$ticket) {
        Response::error("Ticket not found", 404);
    }

    if ($userType === 'community_user' && $ticket['user_id'] != $userId) {
        Response::error("You don't have permission to update this ticket", 403);
    }

    $updateFields = [];
    $params = [':ticket_id' => $ticketId];
    $notificationMessages = [];

    if (isset($input['status'])) {
        $newStatus = $input['status'];
        if ($newStatus !== $ticket['status']) {
            $updateFields[] = "status = :status";
            $params[':status'] = $newStatus;
            $notificationMessages[] = "Ticket status updated to " . $newStatus;
            if ($newStatus === 'Resolved') {
                $updateFields[] = "date_completed = CURRENT_TIMESTAMP";
            }
        }
    }

    if (isset($input['subject'])) {
        $newSubject = $input['subject'];
        if ($newSubject !== $ticket['subject']) {
            $updateFields[] = "subject = :subject";
            $params[':subject'] = $newSubject;
            $notificationMessages[] = "Ticket subject updated";
        }
    }

    if (isset($input['description'])) {
        $newDescription = $input['description'];
        if ($newDescription !== $ticket['description']) {
            $updateFields[] = "description = :description";
            $params[':description'] = $newDescription;
            $notificationMessages[] = "Ticket description updated";
        }
    }

    if (isset($input['issue_type'])) {
        $newIssueType = $input['issue_type'];
        if ($newIssueType !== $ticket['issue_type']) {
            $updateFields[] = "issue_type = :issue_type";
            $params[':issue_type'] = $newIssueType;
            $notificationMessages[] = "Ticket issue type updated to " . $newIssueType;
        }
    }

    if (isset($input['emp_id'])) {
        $newEmp = $input['emp_id'];
        if ($newEmp !== $ticket['emp_id']) {
            $updateFields[] = "emp_id = :emp_id";
            $params[':emp_id'] = $newEmp;
            $notificationMessages[] = "Ticket assignment updated";
        }
    }

    if (empty($updateFields)) {
        Response::error("No fields to update");
    }

    $updateFields[] = "last_action_date_time = CURRENT_TIMESTAMP";

    $query = "UPDATE Tickets SET " . implode(', ', $updateFields) . " WHERE ticket_id = :ticket_id";
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();



    Response::success(['ticket_id' => $ticketId], "Ticket updated successfully");

} catch (Exception $e) {
    error_log("Update ticket error: " . $e->getMessage());
    Response::error("Failed to update ticket: " . $e->getMessage());
}
