<?php
require_once '../bootstrap.php';
require_once '../utils/Database.php';

// Allow only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
    Response::error("User not authenticated", 401);
}

$user_id = $_SESSION['user_id'];
$user_type = $_SESSION['user_type'];

try {

// Fetch tickets based on user type
try {
    $db = new Database();
    $conn = $db->getConnection();

    if ($user_type === 'employee') {
        // Employees see tickets assigned to them, include community user details
        $stmt = $conn->prepare("
            SELECT t.*,
                   cu.full_name as user_full_name, cu.email as user_email,
                   e.first_name as emp_first_name, e.surname as emp_surname, e.email as emp_email
            FROM Tickets t
            LEFT JOIN CommunityUser cu ON t.user_id = cu.id
            LEFT JOIN Employee e ON t.emp_id = e.id
            WHERE t.emp_id = :user_id
            ORDER BY t.date_created DESC
        ");
        $stmt->bindParam(':user_id', $user_id);
    } else {
        // Community users see tickets they created, include employee details
        $stmt = $conn->prepare("
            SELECT t.*,
                   cu.full_name as user_full_name, cu.email as user_email,
                   e.first_name as emp_first_name, e.surname as emp_surname, e.email as emp_email
            FROM Tickets t
            LEFT JOIN CommunityUser cu ON t.user_id = cu.id
            LEFT JOIN Employee e ON t.emp_id = e.id
            WHERE t.user_id = :user_id
            ORDER BY t.date_created DESC
        ");
        $stmt->bindParam(':user_id', $user_id);
    }

    $stmt->execute();
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    Response::success($tickets, "Your tickets fetched successfully");
} catch (Exception $e) {
    Response::error("Error fetching your tickets: " . $e->getMessage());
}
