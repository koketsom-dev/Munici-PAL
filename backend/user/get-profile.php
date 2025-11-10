<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

// Check if user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
    Response::error("User not authenticated", 401);
}

$userId = $_SESSION['user_id'];
$userType = $_SESSION['user_type'] ?? 'community';

try {

    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    if ($userType === 'employee') {
        $query = "SELECT e.id, e.municipality_id, e.first_name, e.surname, e.email, e.gender,
                         e.home_language, e.emp_job_title, e.province, e.access_level,
                         e.ticket_alloc_road, e.ticket_alloc_electricity, e.ticket_alloc_water, e.ticket_alloc_refuse,
                         m.municipality_name
                  FROM Employee e
                  LEFT JOIN MunicipalityRegion m ON e.municipality_id = m.municipality_id
                  WHERE e.id = :user_id";
    } else {
        $query = "SELECT cu.id, cu.municipality_id, cu.full_name, cu.email, cu.gender, cu.home_language,
                         cu.registration_date, cu.issue_report_count, cu.is_moderator,
                         m.municipality_name
                  FROM CommunityUser cu
                  LEFT JOIN MunicipalityRegion m ON cu.municipality_id = m.municipality_id
                  WHERE cu.id = :user_id";
    }

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        Response::error("User not found", 404);
    }

    Response::success($user, "Profile retrieved successfully");

} catch (Exception $e) {
    error_log("Get profile error: " . $e->getMessage());
    Response::error("Failed to retrieve profile: " . $e->getMessage());
}
