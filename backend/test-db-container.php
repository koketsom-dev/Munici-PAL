<?php
header("Content-Type: text/plain");

// Test with container name instead of "db"
$hosts = ['postgres_db', 'db', 'localhost', '172.18.0.2'];
$port = "5432";
$dbname = "municipal_main";
$username = "municipalAdmin";
$password = "Single-Guide-Card-Helpful4-Whispered";

foreach ($hosts as $host) {
    echo "Testing connection to: $host\n";
    try {
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        $conn = new PDO($dsn, $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "SUCCESS: Connected to $host\n\n";
        
        // Test tables
        $tables = ['MunicipalityRegion', 'Employee', 'CommunityUser', 'Tickets'];
        foreach ($tables as $table) {
            try {
                $stmt = $conn->query("SELECT COUNT(*) as count FROM $table");
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                echo "  $table: " . $result['count'] . " records\n";
            } catch (Exception $e) {
                echo "  $table: ERROR - " . $e->getMessage() . "\n";
            }
        }
        break;
    } catch (Exception $e) {
        echo "FAILED: $host - " . $e->getMessage() . "\n\n";
    }
}
?>
