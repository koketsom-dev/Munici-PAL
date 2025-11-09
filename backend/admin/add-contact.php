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
    $contactName = $input['contact_name'] ?? '';
    $cellPhone = $input['cell_phone_number'] ?? '';
    $email = $input['email_address'] ?? '';
    $businessName = $input['business_name'] ?? '';
    $relationshipType = $input['relationship_type'] ?? 'Other';
    $preferredMethod = $input['preferred_contact_method'] ?? 'Email';
    $notes = $input['notes'] ?? '';

    if (empty($contactName) || empty($email)) {
        Response::error("Contact name and email are required");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error("Invalid email format");
    }

    $database = new Database();
    $db = $database->connect();

    $query = "INSERT INTO Contacts (employee_id, contact_name, cell_phone_number, email_address,
              business_name, relationship_type, preferred_contact_method, notes)
              VALUES (:employee_id, :contact_name, :cell_phone, :email, :business_name,
              :relationship_type, :preferred_method, :notes)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':employee_id', $employeeId, PDO::PARAM_INT);
    $stmt->bindParam(':contact_name', $contactName);
    $stmt->bindParam(':cell_phone', $cellPhone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':business_name', $businessName);
    $stmt->bindParam(':relationship_type', $relationshipType);
    $stmt->bindParam(':preferred_method', $preferredMethod);
    $stmt->bindParam(':notes', $notes);
    $stmt->execute();

    $contactId = $db->lastInsertId();

    Response::success(['contact_id' => $contactId], "Contact added successfully");

} catch (Exception $e) {
    error_log("Add contact error: " . $e->getMessage());
    Response::error("Failed to add contact: " . $e->getMessage());
}
