<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $employeeId = $auth['user_id'];

    $input = json_decode(file_get_contents('php://input'), true);
    $leaveType = $input['leave_type'] ?? '';
    $startDate = $input['start_date'] ?? '';
    $endDate = $input['end_date'] ?? '';
    $checkingIn = $input['checking_in'] ?? true;
    $standInEmail = $input['stand_in_email'] ?? '';

    if (empty($leaveType) || empty($startDate) || empty($endDate)) {
        Response::error("Leave type, start date, and end date are required");
    }

    if (strtotime($endDate) < strtotime($startDate)) {
        Response::error("End date cannot be before start date");
    }

    $database = new Database();
    $db = $database->connect();

    $query = "INSERT INTO LeaveCalendar (employee_id, leave_type, start_date, end_date, checking_in, stand_in_email)
              VALUES (:employee_id, :leave_type, :start_date, :end_date, :checking_in, :stand_in_email)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':employee_id', $employeeId, PDO::PARAM_INT);
    $stmt->bindParam(':leave_type', $leaveType);
    $stmt->bindParam(':start_date', $startDate);
    $stmt->bindParam(':end_date', $endDate);
    $stmt->bindParam(':checking_in', $checkingIn, PDO::PARAM_BOOL);
    $stmt->bindParam(':stand_in_email', $standInEmail);
    $stmt->execute();

    $leaveId = $db->lastInsertId();

    Response::success(['leave_id' => $leaveId], "Leave entry added successfully");

} catch (Exception $e) {
    error_log("Add leave entry error: " . $e->getMessage());
    Response::error("Failed to add leave entry: " . $e->getMessage());
}
