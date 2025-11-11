<?php
require_once '../bootstrap.php';

try {
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
        Response::error("User not authenticated", 401);
    }
    $userId = (int)$_SESSION['user_id'];
    $userType = $_SESSION['user_type'];

    $database = new Database();
    $db = $database->connect();

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

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if ($userType === 'employee') {
            $assignmentQuery = "SELECT ticket_id, subject, last_action_date_time
                                 FROM Tickets
                                 WHERE emp_id = :user_id AND new_notification = TRUE
                                 ORDER BY last_action_date_time DESC";
            $assignmentStmt = $db->prepare($assignmentQuery);
            $assignmentStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $assignmentStmt->execute();

            $mentionQuery = "SELECT notification_id, ticket_id, message, created_at
                              FROM employee_ticket_notifications
                              WHERE employee_id = :user_id AND is_read = FALSE
                              ORDER BY created_at DESC";
            $mentionStmt = $db->prepare($mentionQuery);
            $mentionStmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $mentionStmt->execute();

            $notifications = [];
            while ($row = $assignmentStmt->fetch(PDO::FETCH_ASSOC)) {
                $notifications[] = [
                    'id' => 'assignment-' . (int)$row['ticket_id'],
                    'ticket_id' => (int)$row['ticket_id'],
                    'message' => 'Ticket "' . ($row['subject'] ?? 'Untitled Ticket') . '" assigned to you',
                    'ticket_subject' => $row['subject'] ?? null,
                    'created_at' => $row['last_action_date_time'],
                    'type' => 'assignment'
                ];
            }

            while ($row = $mentionStmt->fetch(PDO::FETCH_ASSOC)) {
                $notifications[] = [
                    'id' => 'mention-' . (int)$row['notification_id'],
                    'ticket_id' => (int)$row['ticket_id'],
                    'message' => (string)$row['message'],
                    'ticket_subject' => null,
                    'created_at' => $row['created_at'],
                    'type' => 'mention',
                    'notification_id' => (int)$row['notification_id']
                ];
            }

            usort($notifications, function ($a, $b) {
                $timeA = isset($a['created_at']) ? strtotime($a['created_at']) : 0;
                $timeB = isset($b['created_at']) ? strtotime($b['created_at']) : 0;
                return $timeB <=> $timeA;
            });

            Response::success($notifications, "Notifications retrieved");
        } else {
            $query = "SELECT tn.notification_id, tn.ticket_id, tn.message, tn.created_at, t.subject
                      FROM TicketNotifications tn
                      LEFT JOIN Tickets t ON tn.ticket_id = t.ticket_id
                      WHERE tn.user_id = :user_id AND tn.is_read = FALSE
                      ORDER BY tn.created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
            $stmt->execute();

            $notifications = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $notifications[] = [
                    'id' => (int)$row['notification_id'],
                    'ticket_id' => (int)$row['ticket_id'],
                    'message' => (string)$row['message'],
                    'ticket_subject' => $row['subject'],
                    'created_at' => $row['created_at'],
                    'type' => 'community'
                ];
            }

            Response::success($notifications, "Notifications retrieved");
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true);
        $notificationIds = $input['notification_ids'] ?? [];

        if (!is_array($notificationIds) || empty($notificationIds)) {
            Response::error("notification_ids must be a non-empty array");
        }

        if ($userType === 'employee') {
            $assignmentTicketIds = [];
            $mentionNotificationIds = [];

            foreach ($notificationIds as $item) {
                $type = null;
                $value = null;

                if (is_array($item)) {
                    $type = $item['type'] ?? null;
                    $value = $item['id'] ?? null;
                } elseif (is_string($item)) {
                    if (strpos($item, 'mention-') === 0) {
                        $type = 'mention';
                        $value = substr($item, 8);
                    } elseif (strpos($item, 'assignment-') === 0) {
                        $type = 'assignment';
                        $value = substr($item, 11);
                    } else {
                        $value = $item;
                    }
                } else {
                    $value = $item;
                }

                if ($type === 'mention') {
                    $idValue = filter_var($value, FILTER_VALIDATE_INT);
                    if ($idValue !== false && $idValue > 0) {
                        $mentionNotificationIds[] = (int)$idValue;
                    }
                } else {
                    $idValue = filter_var($value, FILTER_VALIDATE_INT);
                    if ($idValue !== false && $idValue > 0) {
                        $assignmentTicketIds[] = (int)$idValue;
                    }
                }
            }

            $assignmentTicketIds = array_values(array_unique($assignmentTicketIds));
            $mentionNotificationIds = array_values(array_unique($mentionNotificationIds));

            $updatedCount = 0;

            if (!empty($assignmentTicketIds)) {
                $placeholders = [];
                $params = [':user_id' => $userId];
                foreach ($assignmentTicketIds as $index => $ticketId) {
                    $key = ':assignment_' . $index;
                    $placeholders[] = $key;
                    $params[$key] = $ticketId;
                }

                $query = "UPDATE Tickets
                          SET new_notification = FALSE
                          WHERE emp_id = :user_id AND ticket_id IN (" . implode(', ', $placeholders) . ")";
                $stmt = $db->prepare($query);
                $stmt->execute($params);
                $updatedCount += $stmt->rowCount();
            }

            if (!empty($mentionNotificationIds)) {
                $placeholders = [];
                $params = [':user_id' => $userId];
                foreach ($mentionNotificationIds as $index => $notificationId) {
                    $key = ':mention_' . $index;
                    $placeholders[] = $key;
                    $params[$key] = $notificationId;
                }

                $query = "UPDATE employee_ticket_notifications
                          SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
                          WHERE employee_id = :user_id AND notification_id IN (" . implode(', ', $placeholders) . ")";
                $stmt = $db->prepare($query);
                $stmt->execute($params);
                $updatedCount += $stmt->rowCount();
            }

            Response::success(['updated' => $updatedCount], "Notifications marked as read");
        } else {
            $placeholders = [];
            $params = [':user_id' => $userId];
            foreach ($notificationIds as $index => $id) {
                $key = ':id_' . $index;
                $placeholders[] = $key;
                $params[$key] = (int)$id;
            }

            $ticketQuery = "SELECT DISTINCT ticket_id FROM TicketNotifications WHERE user_id = :user_id AND notification_id IN (" . implode(', ', $placeholders) . ")";
            $ticketStmt = $db->prepare($ticketQuery);
            $ticketStmt->execute($params);
            $fetchedTicketIds = $ticketStmt->fetchAll(PDO::FETCH_COLUMN);
            $ticketIds = [];
            foreach ($fetchedTicketIds as $ticketId) {
                $ticketId = (int)$ticketId;
                if ($ticketId > 0) {
                    $ticketIds[] = $ticketId;
                }
            }

            $query = "UPDATE TicketNotifications
                      SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
                      WHERE user_id = :user_id AND notification_id IN (" . implode(', ', $placeholders) . ")";
            $stmt = $db->prepare($query);
            $stmt->execute($params);

            if (!empty($ticketIds)) {
                $unreadStmt = $db->prepare("SELECT COUNT(*) FROM TicketNotifications WHERE user_id = :user_id AND ticket_id = :ticket_id AND is_read = FALSE");
                $updateTicketStmt = $db->prepare("UPDATE Tickets SET new_notification = FALSE WHERE ticket_id = :ticket_id");
                foreach ($ticketIds as $ticketId) {
                    $unreadStmt->execute([
                        ':user_id' => $userId,
                        ':ticket_id' => $ticketId
                    ]);
                    if ((int)$unreadStmt->fetchColumn() === 0) {
                        $updateTicketStmt->execute([':ticket_id' => $ticketId]);
                    }
                }
            }

            Response::success(['updated' => $stmt->rowCount()], "Notifications marked as read");
        }
    } else {
        Response::error("Method not allowed", 405);
    }
} catch (Exception $e) {
    error_log("Notifications error: " . $e->getMessage());
    Response::error("Failed to handle notifications");
}
