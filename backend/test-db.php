<?php
$host = getenv('DB_HOST');
$dbname = getenv('DB_NAME');
$user = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

try {
    $dsn = "pgsql:host=$host;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    echo "<h2>✅ Database connection successful!</h2>";
} catch (PDOException $e) {
    echo "<h2>❌ Connection failed:</h2> " . $e->getMessage();
}
?>
