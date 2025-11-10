<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
        Response::error("User not authenticated", 401);
    }
    $userId = $_SESSION['user_id'];
    $userType = $_SESSION['user_type'];
    $municipalityId = $_SESSION['municipality_id'] ?? 1;

    $input = json_decode(file_get_contents('php://input'), true);

    $subject = $input['subject'] ?? '';
    $description = $input['description'] ?? '';
    $issueType = $input['issue_type'] ?? '';
    $location = $input['location'] ?? [];

    if (empty($subject) || empty($description) || empty($issueType)) {
        Response::error("Subject, description, and issue type are required");
    }

    $validIssueTypes = ['Electricity', 'Refuse', 'Roads', 'Water'];
    if (!in_array($issueType, $validIssueTypes)) {
        Response::error("Invalid issue type. Must be one of: " . implode(', ', $validIssueTypes));
    }

    $database = new Database();
    $db = $database->connect();

    $db->beginTransaction();

    try {
        $locationId = null;
        if (!empty($location)) {
            try {
                $locationQuery = "INSERT INTO TicketLocation 
                                (user_id, municipality_id, country, province, postal_code, city_town, suburb, street_name)
                                VALUES (:user_id, :municipality_id, :country, :province, :postal_code, :city_town, :suburb, :street_name)";

                $locationStmt = $db->prepare($locationQuery);
                $country = $location['country'] ?? 'South Africa';
                $province = $location['province'] ?? null;
                $postal_code = $location['postal_code'] ?? null;
                $city_town = $location['city_town'] ?? null;
                $suburb = $location['suburb'] ?? null;
                $street_name = $location['street_name'] ?? null;

                $locationStmt->bindParam(':user_id', $userId);
                $locationStmt->bindParam(':municipality_id', $municipalityId);
                $locationStmt->bindParam(':country', $country);
                $locationStmt->bindParam(':province', $province);
                $locationStmt->bindParam(':postal_code', $postal_code);
                $locationStmt->bindParam(':city_town', $city_town);
                $locationStmt->bindParam(':suburb', $suburb);
                $locationStmt->bindParam(':street_name', $street_name);
                $locationStmt->execute();

                $locationId = $db->lastInsertId();
            } catch (Exception $locEx) {
                error_log("Location insert warning: " . $locEx->getMessage());
            }
        }

        $ticketQuery = "INSERT INTO Tickets 
                       (municipality_id, location_id, user_id, subject, description, issue_type, status)
                       VALUES (:municipality_id, :location_id, :user_id, :subject, :description, :issue_type, 'Pending')";

        $ticketStmt = $db->prepare($ticketQuery);
        $ticketStmt->bindParam(':municipality_id', $municipalityId);
        $ticketStmt->bindParam(':location_id', $locationId, PDO::PARAM_INT);
        $ticketStmt->bindParam(':user_id', $userId);
        $ticketStmt->bindParam(':subject', $subject);
        $ticketStmt->bindParam(':description', $description);
        $ticketStmt->bindParam(':issue_type', $issueType);
        $ticketStmt->execute();

        $ticketId = $db->lastInsertId();
        if (!$ticketId) {
            throw new Exception("Failed to create ticket");
        }

        $ticket = [
            'ticket_id' => $ticketId,
            'date_created' => date('Y-m-d H:i:s')
        ];

        if ($userType === 'community_user') {
            $updateQuery = "UPDATE CommunityUser SET issue_report_count = issue_report_count + 1 WHERE id = :user_id";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(':user_id', $userId);
            $updateStmt->execute();
        }

        $db->commit();

        Response::success([
            'ticket_id' => (int)$ticket['ticket_id'],
            'subject' => (string)$subject,
            'issue_type' => (string)$issueType,
            'status' => 'Pending',
            'date_created' => (string)$ticket['date_created']
        ], "Ticket created successfully");

    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Add ticket error: " . $e->getMessage());
    Response::error("Failed to create ticket: " . $e->getMessage());
}
