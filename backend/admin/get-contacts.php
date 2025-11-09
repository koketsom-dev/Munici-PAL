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

    $query = "SELECT contact_id, contact_name, cell_phone_number, email_address, business_name,
                     relationship_type, preferred_contact_method, notes, date_added
              FROM Contacts
              WHERE employee_id = :employee_id
              ORDER BY date_added DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':employee_id', $employeeId, PDO::PARAM_INT);
    $stmt->execute();

    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::success($contacts, "Contacts retrieved successfully");

} catch (Exception $e) {
    error_log("Get contacts error: " . $e->getMessage());
    Response::error("Failed to retrieve contacts: " . $e->getMessage());
}
