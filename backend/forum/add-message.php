<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $userId = $auth['user_id'];

    $input = json_decode(file_get_contents('php://input'), true);
    $subject = $input['message_subject'] ?? 'General';
    $message = $input['message_description'] ?? '';
    $roomId = (int)($input['room_id'] ?? 1);
    $ticketId = !empty($input['ticket_id']) ? (int)$input['ticket_id'] : null;
    $isPrivate = isset($input['is_private']) ? $input['is_private'] : null;

    if (empty($message)) {
        Response::error("Message cannot be empty");
    }

    if (strlen($message) > 255) {
        Response::error("Message cannot exceed 255 characters");
    }

    if (strlen($subject) > 50) {
        Response::error("Subject cannot exceed 50 characters");
    }

    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $query = "INSERT INTO ChatMessages (user_id, room_id, message_subject, message_description, message_sent_timestamp, ticket_id, is_private)
              VALUES (:user_id, :room_id, :subject, :description, NOW(), :ticket_id, :is_private)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':room_id', $roomId, PDO::PARAM_INT);
    $stmt->bindParam(':subject', $subject);
    $stmt->bindParam(':description', $message);
    $stmt->bindParam(':ticket_id', $ticketId, $ticketId ? PDO::PARAM_INT : PDO::PARAM_NULL);
    $stmt->bindParam(':is_private', $isPrivate, $isPrivate !== null ? PDO::PARAM_BOOL : PDO::PARAM_NULL);
    $stmt->execute();

    $messageId = $db->lastInsertId();

    if (!$messageId) {
        throw new Exception("Failed to retrieve message ID");
    }

    $fetchQuery = "SELECT cm.message_id, cm.user_id, cm.message_subject, cm.message_description, cm.message_sent_timestamp,
                          COALESCE(cu.full_name, e.first_name || ' ' || e.surname) as user_name
                   FROM ChatMessages cm
                   LEFT JOIN CommunityUser cu ON cm.user_id = cu.id
                   LEFT JOIN Employee e ON cm.user_id = e.id
                   WHERE cm.message_id = :message_id";

    $fetchStmt = $db->prepare($fetchQuery);
    $fetchStmt->bindParam(':message_id', $messageId, PDO::PARAM_INT);
    $fetchStmt->execute();

    $newMessage = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    Response::success($newMessage, "Message posted successfully");

} catch (Exception $e) {
    error_log("Add forum message error: " . $e->getMessage());
    Response::error("Failed to post message: " . $e->getMessage());
}
