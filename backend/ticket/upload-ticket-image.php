<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $userId = $auth['user_id'];

    $ticketId = $_POST['ticket_id'] ?? null;
    
    if (!$ticketId) {
        Response::error("Ticket ID is required");
    }

    if (!isset($_FILES['image'])) {
        Response::error("No image file provided");
    }

    $file = $_FILES['image'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        Response::error("File upload error: " . $file['error']);
    }

    $maxFileSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxFileSize) {
        Response::error("File size exceeds 5MB limit");
    }

    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedMimes)) {
        Response::error("Invalid image format. Allowed: JPG, PNG, GIF, WebP");
    }

    $database = new Database();
    $db = $database->connect();

    $ticketQuery = "SELECT ticket_id FROM Tickets WHERE ticket_id = :ticket_id AND user_id = :user_id";
    $ticketStmt = $db->prepare($ticketQuery);
    $ticketStmt->bindParam(':ticket_id', $ticketId);
    $ticketStmt->bindParam(':user_id', $userId);
    $ticketStmt->execute();

    if (!$ticketStmt->fetch()) {
        Response::error("Ticket not found or unauthorized");
    }

    $uploadsDir = __DIR__ . '/../../uploads/tickets/';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0755, true);
    }

    $fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'ticket_' . $ticketId . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $fileExtension;
    $filepath = $uploadsDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        Response::error("Failed to save image file");
    }

    $imageUrl = '/uploads/tickets/' . $filename;

    $insertQuery = "INSERT INTO TicketImages (ticket_id, image_url, uploaded_at) 
                   VALUES (:ticket_id, :image_url, NOW())";
    
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(':ticket_id', $ticketId);
    $insertStmt->bindParam(':image_url', $imageUrl);
    $insertStmt->execute();

    $lastId = $db->lastInsertId();
    $result = [
        'image_id' => $lastId,
        'image_url' => $imageUrl
    ];

    Response::success([
        'image_id' => $result['image_id'],
        'image_url' => $result['image_url']
    ], "Image uploaded successfully");

} catch (Exception $e) {
    error_log("Upload ticket image error: " . $e->getMessage());
    Response::error("Failed to upload image: " . $e->getMessage());
}
