<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();

    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);
    $roomId = (int)($_GET['room_id'] ?? 1);
    $ticketId = isset($_GET['ticket_id']) ? (int)$_GET['ticket_id'] : null;
    $isPrivate = isset($_GET['is_private']) ? (bool)$_GET['is_private'] : null;

    $whereConditions = ["cm.room_id = :room_id", "cm.parent_message_id IS NULL"];
    $params = [':room_id' => $roomId];

    if ($ticketId !== null) {
        $whereConditions[] = "cm.ticket_id = :ticket_id";
        $params[':ticket_id'] = $ticketId;
    }

    if ($isPrivate !== null) {
        $whereConditions[] = "cm.is_private = :is_private";
        $params[':is_private'] = $isPrivate;
    }

    $whereClause = implode(" AND ", $whereConditions);

    $query = "SELECT cm.message_id, cm.user_id, cm.message_subject, cm.message_description, cm.message_sent_timestamp,
                     cm.ticket_id, cm.is_private,
                     COALESCE(cu.full_name, e.first_name || ' ' || e.surname) as user_name
              FROM ChatMessages cm
              LEFT JOIN CommunityUser cu ON cm.user_id = cu.id
              LEFT JOIN Employee e ON cm.user_id = e.id
              WHERE $whereClause
              ORDER BY cm.message_sent_timestamp DESC
              LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : (is_bool($value) ? PDO::PARAM_BOOL : PDO::PARAM_STR));
    }
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $messages = array_reverse($messages);

    Response::success([
        'messages' => $messages,
        'count' => count($messages)
    ], "Messages retrieved successfully");

} catch (Exception $e) {
    error_log("Get forum messages error: " . $e->getMessage());
    Response::error("Failed to retrieve messages: " . $e->getMessage());
}
