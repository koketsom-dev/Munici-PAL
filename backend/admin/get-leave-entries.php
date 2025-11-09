<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $employeeId = $auth['user_id'];

    $database = new Database();
    $db = $database->connect();

    $query = "SELECT leave_id, leave_type, start_date, end_date, checking_in, stand_in_email, date_added
              FROM LeaveCalendar
              WHERE employee_id = :employee_id
              ORDER BY date_added DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':employee_id', $employeeId, PDO::PARAM_INT);
    $stmt->execute();

    $leaveEntries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success($leaveEntries, "Leave entries retrieved successfully");

} catch (Exception $e) {
    error_log("Get leave entries error: " . $e->getMessage());
    Response::error("Failed to retrieve leave entries: " . $e->getMessage());
}
