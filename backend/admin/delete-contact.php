<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();

    $input = json_decode(file_get_contents('php://input'), true);
    $contactId = $input['contact_id'] ?? null;

    if (!$contactId) {
        Response::error("Contact ID is required");
    }

    $database = new Database();
    $db = $database->connect();

    $query = "DELETE FROM Contacts WHERE contact_id = :contact_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':contact_id', $contactId, PDO::PARAM_INT);
    $stmt->execute();

    Response::success([], "Contact deleted successfully");

} catch (Exception $e) {
    error_log("Delete contact error: " . $e->getMessage());
    Response::error("Failed to delete contact: " . $e->getMessage());
}
