<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    // Authenticate user
    $auth = Auth::authenticate();
    $userId = $auth['user_id'];
    $userType = $auth['user_type'];
    $municipalityId = $auth['municipality_id'] ?? 1;

    $database = new Database();
    $db = $database->connect();

    // Get search parameters
    $searchTerm = $_GET['search'] ?? '';
    $ticketId = $_GET['id'] ?? null;

    if ($ticketId) {
        // Get specific ticket by ID
        $query = "SELECT t.ticket_id, t.user_id, t.subject, t.description, t.issue_type, t.status, 
                         t.date_created, t.date_completed, t.emp_id,
                         cu.full_name as user_name, cu.email as user_email,
                         e.first_name || ' ' || e.surname as employee_name,
                         tl.suburb, tl.street_name, tl.city_town, tl.province, tl.postal_code
                  FROM Tickets t
                  LEFT JOIN CommunityUser cu ON t.user_id = cu.id
                  LEFT JOIN Employee e ON t.emp_id = e.id
                  LEFT JOIN TicketLocation tl ON t.location_id = tl.location_id
                  WHERE t.ticket_id = :ticket_id AND t.municipality_id = :municipality_id";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':ticket_id', $ticketId, PDO::PARAM_INT);
        $stmt->bindParam(':municipality_id', $municipalityId, PDO::PARAM_INT);
        $stmt->execute();
        
        $ticket = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$ticket) {
            Response::error("Ticket not found", 404);
        }

        // Check permissions
        if ($userType === 'community_user' && $ticket['user_id'] != $userId) {
            Response::error("You don't have permission to view this ticket", 403);
        }

        Response::success([
            'id' => $ticket['ticket_id'],
            'title' => $ticket['subject'],
            'description' => $ticket['description'],
            'issue_type' => $ticket['issue_type'],
            'status' => $ticket['status'],
            'location' => [
                'suburb' => $ticket['suburb'],
                'street_name' => $ticket['street_name'],
                'city_town' => $ticket['city_town'],
                'province' => $ticket['province'],
                'postal_code' => $ticket['postal_code']
            ],
            'createdAt' => $ticket['date_created'],
            'completedAt' => $ticket['date_completed'],
            'assignedTo' => $ticket['employee_name'],
            'user_name' => $ticket['user_name'],
            'user_email' => $ticket['user_email']
        ], "Ticket retrieved successfully");

    } elseif ($searchTerm) {
        // Search tickets by term
        $query = "SELECT t.ticket_id, t.subject, t.description, t.issue_type, t.status, 
                         t.date_created, t.date_completed,
                         cu.full_name as user_name,
                         e.first_name || ' ' || e.surname as employee_name,
                         tl.suburb, tl.street_name
                  FROM Tickets t
                  LEFT JOIN CommunityUser cu ON t.user_id = cu.id
                  LEFT JOIN Employee e ON t.emp_id = e.id
                  LEFT JOIN TicketLocation tl ON t.location_id = tl.location_id
                  WHERE t.municipality_id = :municipality_id
                  AND (t.subject ILIKE :search OR t.description ILIKE :search)";

        $params = [
            ':municipality_id' => $municipalityId,
            ':search' => '%' . $searchTerm . '%'
        ];

        // Apply user filter
        if ($userType === 'community_user') {
            $query .= " AND t.user_id = :user_id";
            $params[':user_id'] = $userId;
        }

        $query .= " ORDER BY t.date_created DESC LIMIT 50";

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

        Response::success($tickets, "Search completed successfully");
    } else {
        Response::error("Please provide either a ticket ID or search term");
    }

} catch (Exception $e) {
    error_log("Ticket search error: " . $e->getMessage());
    Response::error("Failed to search tickets: " . $e->getMessage());
}
