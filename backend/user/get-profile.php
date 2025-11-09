<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $userId = $auth['user_id'];
    $userType = $auth['user_type'] ?? 'community';

    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    if ($userType === 'employee') {
        $query = "SELECT id, municipality_id, first_name, surname, email, gender, 
                         home_language, emp_job_title, province
                  FROM Employee
                  WHERE id = :user_id";
    } else {
        $query = "SELECT id, municipality_id, full_name, email, gender, home_language
                  FROM CommunityUser
                  WHERE id = :user_id";
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
