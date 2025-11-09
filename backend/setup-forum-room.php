<?php
require_once 'bootstrap.php';

try {
    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        echo "Database connection failed";
        exit;
    }

    $checkQuery = "SELECT room_id FROM Room WHERE room_id = 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        $insertQuery = "INSERT INTO Room (room_id, room_name, is_active, date_created)
                       VALUES (1, 'Community Forum', true, CURRENT_DATE)";
        $db->exec($insertQuery);
        echo "✓ Default forum room created<br>";
    } else {
        echo "✓ Forum room already exists<br>";
    }

    echo "<strong>Setup complete!</strong>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
