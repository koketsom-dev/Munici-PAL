<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Include database config
    require_once '../../config/database.php';
    
    $database = new Database();
    $db = $database->getConnection();

    // For testing, use municipality_id = 1
    $municipality_id = 1;
    
    // Total tickets count
    $query = "SELECT COUNT(*) as total_tickets FROM Tickets WHERE municipality_id = :municipality_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipality_id);
    $stmt->execute();
    $total_tickets = $stmt->fetch(PDO::FETCH_ASSOC)['total_tickets'];
    
    // Tickets by status
    $query = "SELECT status, COUNT(*) as count FROM Tickets 
              WHERE municipality_id = :municipality_id 
              GROUP BY status";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipality_id);
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
    $stmt->bindParam(':municipality_id', $municipality_id);
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
    $stmt->bindParam(':municipality_id', $municipality_id);
    $stmt->execute();
    
    $recent_tickets = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $recent_tickets[] = $row;
    }
    
    // Get municipality name
    $query = "SELECT municipality_name FROM MunicipalityRegion WHERE municipality_id = :municipality_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':municipality_id', $municipality_id);
    $stmt->execute();
    $municipality_result = $stmt->fetch(PDO::FETCH_ASSOC);
    $municipality_name = $municipality_result ? $municipality_result['municipality_name'] : 'Unknown Municipality';
    
    // Prepare response
    $response = array(
        "success" => true,
        "data" => array(
            "stats" => array(
                "total_tickets" => (int)$total_tickets,
                "pending_tickets" => $status_counts['Pending'],
                "in_progress_tickets" => $status_counts['In Progress'],
                "resolved_tickets" => $status_counts['Resolved'],
                "electricity_tickets" => $issue_type_counts['Electricity'],
                "water_tickets" => $issue_type_counts['Water'],
                "roads_tickets" => $issue_type_counts['Roads'],
                "refuse_tickets" => $issue_type_counts['Refuse'],
                "municipality_name" => $municipality_name
            ),
            "recent_tickets" => $recent_tickets
        )
    );
    
    http_response_code(200);
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Dashboard error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Error fetching dashboard data",
        "error" => $e->getMessage()
    ));
}
?>