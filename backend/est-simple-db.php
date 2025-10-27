<?php
echo "Starting database test...\n";

// Simple test without requiring files
try {
    $host = "postgres_db";
    $port = "5432";
    $dbname = "municipal_main";
    $username = "municipalAdmin";
    $password = "Single-Guide-Card-Helpful4-Whispered";
    
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "SUCCESS: Database connected!\n";
    
    // Simple query
    $stmt = $conn->query("SELECT 1 as test");
    $result = $stmt->fetch();
    echo "Query test: " . $result['test'] . "\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "Test completed.\n";
?>