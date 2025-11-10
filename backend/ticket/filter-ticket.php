<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    // Authenticate user
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
        Response::error("User not authenticated", 401);
    }
    $userId = $_SESSION['user_id'];
    $userType = $_SESSION['user_type'];
    $municipalityId = $_SESSION['municipality_id'] ?? 1;

    $database = new Database();
    $db = $database->connect();

    // Get filter parameters
    $status = $_GET['status'] ?? null;
    $issueType = $_GET['issue_type'] ?? null;
    $assignedTo = $_GET['assigned_to'] ?? null;

    // Build query
    $query = "SELECT t.ticket_id, t.subject, t.description, t.issue_type, t.status, 
                     t.date_created, t.date_completed, t.emp_id,
                     cu.full_name as user_name, cu.email as user_email,
                     e.first_name || ' ' || e.surname as employee_name,
                     tl.suburb, tl.street_name, tl.city_town
              FROM Tickets t
              LEFT JOIN CommunityUser cu ON t.user_id = cu.id
              LEFT JOIN Employee e ON t.emp_id = e.id
              LEFT JOIN TicketLocation tl ON t.location_id = tl.location_id
              WHERE t.municipality_id = :municipality_id";

    $params = [':municipality_id' => $municipalityId];

    // Apply filters based on user type
    if ($userType === 'community_user') {
        $query .= " AND t.user_id = :user_id";
        $params[':user_id'] = $userId;
    } elseif ($userType === 'employee' && $assignedTo) {
        $query .= " AND t.emp_id = :emp_id";
        $params[':emp_id'] = $assignedTo;
    }

    if ($status) {
        $query .= " AND t.status = :status";
        $params[':status'] = $status;
    }

    if ($issueType) {
        $query .= " AND t.issue_type = :issue_type";
        $params[':issue_type'] = $issueType;
    }

    $query .= " ORDER BY t.date_created DESC";

    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->execute();

    $tickets = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $tickets[] = [
            'id' => $row['ticket_id'],
            'title' => $row['subject'],
            'description' => $row['description'],
            'issue_type' => $row['issue_type'],
            'status' => $row['status'],
            'location' => $row['suburb'] . ($row['street_name'] ? ', ' . $row['street_name'] : ''),
            'createdAt' => $row['date_created'],
            'completedAt' => $row['date_completed'],
            'assignedTo' => $row['employee_name'],
            'user_name' => $row['user_name'],
            'user_email' => $row['user_email']
        ];
    }

    Response::success($tickets, "Tickets retrieved successfully");

} catch (Exception $e) {
    error_log("Filter ticket error: " . $e->getMessage());
    Response::error("Failed to retrieve tickets: " . $e->getMessage());
}
