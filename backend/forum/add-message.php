<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    if (!isset($_SESSION['user_id'])) {
        Response::error("User not authenticated", 401);
    }
    $userId = $_SESSION['user_id'];

    $input = json_decode(file_get_contents('php://input'), true);
    $subject = $input['message_subject'] ?? 'General';
    $message = $input['message_description'] ?? '';
    $roomId = (int)($input['room_id'] ?? 1);
    $ticketId = isset($input['ticket_id']) && $input['ticket_id'] !== '' ? (int)$input['ticket_id'] : null;
    $isPrivate = isset($input['is_private']) ? $input['is_private'] : null;
    $mentionsInput = isset($input['mentions']) && is_array($input['mentions']) ? $input['mentions'] : [];
    $mentionIds = [];

    foreach ($mentionsInput as $candidate) {
        if (is_array($candidate) && isset($candidate['employee_id'])) {
            $candidate = $candidate['employee_id'];
        }
        if (filter_var($candidate, FILTER_VALIDATE_INT) !== false) {
            $mentionIds[] = (int)$candidate;
        }
    }
    $mentionIds = array_values(array_unique(array_filter($mentionIds, fn($value) => $value > 0)));

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

    if (!empty($mentionIds) && $ticketId !== null) {
        $createTableSql = "CREATE TABLE IF NOT EXISTS employee_ticket_notifications (
            notification_id SERIAL PRIMARY KEY,
            ticket_id INT REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
            employee_id INT REFERENCES Employee(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            chat_message_id INT REFERENCES ChatMessages(message_id) ON DELETE CASCADE,
            created_by INT,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            read_at TIMESTAMP,
            UNIQUE (ticket_id, employee_id, chat_message_id)
        )";
        $db->exec($createTableSql);

        $placeholders = implode(',', array_fill(0, count($mentionIds), '?'));
        $employeeStmt = $db->prepare("SELECT id, TRIM(CONCAT_WS(' ', first_name, surname)) AS full_name FROM Employee WHERE id IN ($placeholders)");
        $employeeStmt->execute($mentionIds);
        $validEmployees = $employeeStmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($validEmployees)) {
            $notificationSql = "INSERT INTO employee_ticket_notifications (ticket_id, employee_id, message, chat_message_id, created_by)
                                VALUES (:ticket_id, :employee_id, :message, :chat_message_id, :created_by)
                                ON CONFLICT (ticket_id, employee_id, chat_message_id) DO NOTHING";
            $notificationStmt = $db->prepare($notificationSql);
            $createdBy = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
            $actorType = $_SESSION['user_type'] ?? null;
            foreach ($validEmployees as $employee) {
                $employeeId = (int)$employee['id'];
                if ($employeeId <= 0) {
                    continue;
                }
                if ($actorType === 'employee' && $employeeId === (int)$userId) {
                    continue;
                }
                $messageSnippet = mb_substr($message, 0, 200);
                $text = "You were mentioned in ticket #" . $ticketId;
                if (!empty($messageSnippet)) {
                    $text .= ": " . $messageSnippet;
                }
                $notificationStmt->execute([
                    ':ticket_id' => $ticketId,
                    ':employee_id' => $employeeId,
                    ':message' => $text,
                    ':chat_message_id' => (int)$messageId,
                    ':created_by' => $createdBy
                ]);
            }
        }
    }

    Response::success($newMessage, "Message posted successfully");

} catch (Exception $e) {
    error_log("Add forum message error: " . $e->getMessage());
    Response::error("Failed to post message: " . $e->getMessage());
}
