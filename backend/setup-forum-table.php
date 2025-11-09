<?php
require_once 'bootstrap.php';

try {
    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    $createTableQuery = "CREATE TABLE IF NOT EXISTS forum_messages (
        message_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        municipality_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    $db->exec($createTableQuery);
    echo "✓ forum_messages table created<br>";

    $indexQuery = "CREATE INDEX IF NOT EXISTS idx_forum_municipality ON forum_messages(municipality_id, created_at DESC)";
    $db->exec($indexQuery);
    echo "✓ Index created<br>";

    echo "<br><strong>Setup complete!</strong>";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
