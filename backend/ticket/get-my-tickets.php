<?php
require_once '../bootstrap.php';
require_once '../utils/Database.php';

// Allow only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Check if user is logged in using simple session check
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
    Response::error("User not authenticated", 401);
}

$user_id = $_SESSION['user_id'];
$user_type = $_SESSION['user_type'];

try {
    $db = new Database();
    $conn = $db->getConnection();

    $query = "
        SELECT
            t.*,
            cu.full_name as user_full_name,
            cu.email as user_email,
            e.first_name as emp_first_name,
            e.surname as emp_surname,
            e.email as emp_email,
            t.emp_id as assigned_to_id,
            TRIM(CONCAT_WS(' ', e.first_name, e.surname)) as assigned_to
        FROM Tickets t
        LEFT JOIN CommunityUser cu ON t.user_id = cu.id
        LEFT JOIN Employee e ON t.emp_id = e.id
        WHERE %s
        ORDER BY t.date_created DESC
    ";
    $condition = $user_type === 'employee' ? 't.emp_id = :user_id' : 't.user_id = :user_id';
    $stmt = $conn->prepare(sprintf($query, $condition));
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Response::success($tickets, "Your tickets fetched successfully");
} catch (Exception $e) {
    Response::error("Error fetching your tickets: " . $e->getMessage());
}
