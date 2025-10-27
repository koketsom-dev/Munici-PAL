<?php
echo "Testing database connection...\n";

try {
    $host = "postgres_db";
    $port = "5432";
    $dbname = "municipal_main";
    $username = "municipalAdmin";
    $password = "Single-Guide-Card-Helpful4-Whispered";
    
    echo "Connecting to: $host\n";
    
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "SUCCESS: Database connected!\n";
    
    // Test if we can query
    $stmt = $conn->query("SELECT version() as version");
    $result = $stmt->fetch();
    echo "PostgreSQL Version: " . $result['version'] . "\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "Test completed.\n";
?>