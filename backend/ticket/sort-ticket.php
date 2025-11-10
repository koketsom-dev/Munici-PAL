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

    // Get sort parameters
    $sortBy = $_GET['sort_by'] ?? 'date_created';
    $order = strtoupper($_GET['order'] ?? 'DESC');

    // Validate sort column
    $allowedSortColumns = ['date_created', 'status', 'issue_type', 'subject'];
    if (!in_array($sortBy, $allowedSortColumns)) {
        $sortBy = 'date_created';
    }

    // Validate order
    if (!in_array($order, ['ASC', 'DESC'])) {
        $order = 'DESC';
    }

    // Build query
    $query = "SELECT t.ticket_id, t.subject, t.description, t.issue_type, t.status, 
                     t.date_created, t.date_completed,
                     cu.full_name as user_name,
                     e.first_name || ' ' || e.surname as employee_name,
                     tl.suburb, tl.street_name
              FROM Tickets t
              LEFT JOIN CommunityUser cu ON t.user_id = cu.id
              LEFT JOIN Employee e ON t.emp_id = e.id
              LEFT JOIN TicketLocation tl ON t.location_id = tl.location_id
              WHERE t.municipality_id = :municipality_id";

    $params = [':municipality_id' => $municipalityId];

    // Apply user filter
    if ($userType === 'community_user') {
        $query .= " AND t.user_id = :user_id";
        $params[':user_id'] = $userId;
    }

    $query .= " ORDER BY t." . $sortBy . " " . $order;

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
            'user_name' => $row['user_name']
        ];
    }

    Response::success($tickets, "Tickets sorted successfully");

} catch (Exception $e) {
    error_log("Sort ticket error: " . $e->getMessage());
    Response::error("Failed to sort tickets: " . $e->getMessage());
}
