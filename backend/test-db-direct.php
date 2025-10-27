<?php
// Direct database test - bypasses routing
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

try {
    // Include database config directly
    require_once __DIR__ . '/config/database.php';
    
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Database connected successfully!\n";
    
    // Test each table
    $tables = ['Employee', 'CommunityUser', 'Tickets', 'MunicipalityRegion'];
    $results = [];

    foreach ($tables as $table) {
        try {
            $stmt = $db->query("SELECT COUNT(*) as count FROM $table");
            $result = $stmt->fetch();
            $results[$table] = [
                "exists" => true,
                "row_count" => (int)$result['count']
            ];
            echo "$table: " . $result['count'] . " records\n";
        } catch (Exception $e) {
            $results[$table] = [
                "exists" => false,
                "error" => $e->getMessage()
            ];
            echo "$table: ERROR - " . $e->getMessage() . "\n";
        }
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>