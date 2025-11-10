<?php
require_once '../../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    // Authenticate user
    if (!isset($_SESSION['user_id'])) {
        Response::error("User not authenticated", 401);
    }
    $municipalityId = $_SESSION['municipality_id'] ?? 1;
    
    $database = new Database();
    $db = $database->connect();
    
    // Total tickets count
    $query = "SELECT COUNT(*) as total_tickets FROM Tickets WHERE municipality_id = :municipality_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId);
    $stmt->execute();
    $total_tickets = $stmt->fetch(PDO::FETCH_ASSOC)['total_tickets'];
    
    // Tickets by status
    $query = "SELECT status, COUNT(*) as count FROM Tickets 
              WHERE municipality_id = :municipality_id 
              GROUP BY status";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId);
    $stmt->execute();
    
    $status_counts = array('Pending' => 0, 'In Progress' => 0, 'Resolved' => 0);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $status_counts[$row['status']] = (int)$row['count'];
    }
    
    // Tickets by issue type
    $query = "SELECT issue_type, COUNT(*) as count FROM Tickets 
              WHERE municipality_id = :municipality_id 
              GROUP BY issue_type";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId);
    $stmt->execute();
    
    $issue_type_counts = array('Electricity' => 0, 'Water' => 0, 'Roads' => 0, 'Refuse' => 0);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $issue_type_counts[$row['issue_type']] = (int)$row['count'];
    }
    
    // Recent tickets (last 10)
    $query = "SELECT t.ticket_id, t.subject, t.issue_type, t.status, t.date_created, 
                     u.full_name as user_name
              FROM Tickets t
              LEFT JOIN CommunityUser u ON t.user_id = u.id
              WHERE t.municipality_id = :municipality_id
              ORDER BY t.date_created DESC 
              LIMIT 10";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId);
    $stmt->execute();
    
    $recent_tickets = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $recent_tickets[] = $row;
    }
    
    // Get municipality name
    $query = "SELECT municipality_name FROM MunicipalityRegion WHERE municipality_id = :municipality_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipalityId);
    $stmt->execute();
    $municipality_result = $stmt->fetch(PDO::FETCH_ASSOC);
    $municipality_name = $municipality_result ? $municipality_result['municipality_name'] : 'Unknown Municipality';
    
    // Prepare response
    Response::success([
        "stats" => [
            "total_tickets" => (int)$total_tickets,
            "pending_tickets" => $status_counts['Pending'],
            "in_progress_tickets" => $status_counts['In Progress'],
            "resolved_tickets" => $status_counts['Resolved'],
            "electricity_tickets" => $issue_type_counts['Electricity'],
            "water_tickets" => $issue_type_counts['Water'],
            "roads_tickets" => $issue_type_counts['Roads'],
            "refuse_tickets" => $issue_type_counts['Refuse'],
            "municipality_name" => $municipality_name
        ],
        "recent_tickets" => $recent_tickets
    ], "Dashboard stats retrieved successfully");
    
} catch (Exception $e) {
    error_log("Dashboard error: " . $e->getMessage());
    Response::error("Error fetching dashboard data: " . $e->getMessage());
}