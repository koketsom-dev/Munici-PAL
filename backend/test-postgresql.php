<?php
require_once 'utils/postgresql.php';

// Test the array functions
$test_array = ['apple', 'banana', 'orange'];
$pg_format = PostgreSQLUtils::toPgArray($test_array);
echo "PostgreSQL format: " . $pg_format . "\n";

$php_format = PostgreSQLUtils::fromPgArray($pg_format);
echo "PHP format: ";
print_r($php_format);
?>