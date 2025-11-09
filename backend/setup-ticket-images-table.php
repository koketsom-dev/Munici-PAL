<?php
require_once 'bootstrap.php';

try {
    $database = new Database();
    $db = $database->connect();

    $createTableQuery = "
    CREATE TABLE IF NOT EXISTS TicketImages (
        image_id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES Tickets(ticket_id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_ticket_images_ticket_id ON TicketImages(ticket_id);
    ";

    $db->exec($createTableQuery);

    echo json_encode([
        'success' => true,
        'message' => 'TicketImages table created successfully'
    ]);

} catch (Exception $e) {
    error_log("Setup error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to create table: ' . $e->getMessage()
    ]);
}
