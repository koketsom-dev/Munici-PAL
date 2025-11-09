<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();

    $input = json_decode(file_get_contents('php://input'), true);
    $leaveId = $input['leave_id'] ?? null;

    if (!$leaveId) {
        Response::error("Leave ID is required");
    }

    $database = new Database();
    $db = $database->connect();

    $query = "DELETE FROM LeaveCalendar WHERE leave_id = :leave_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':leave_id', $leaveId, PDO::PARAM_INT);
    $stmt->execute();

    Response::success([], "Leave entry deleted successfully");

} catch (Exception $e) {
    error_log("Delete leave entry error: " . $e->getMessage());
    Response::error("Failed to delete leave entry: " . $e->getMessage());
}
