<?php
require_once 'bootstrap.php';

$testToken = 'test_token_here';

$testData = [
    'subject' => 'Test Road Issue',
    'description' => 'Test description for ticket',
    'issue_type' => 'Roads',
    'location' => [
        'country' => 'South Africa',
        'suburb' => 'Johannesburg',
        'street_name' => 'Main Street'
    ]
];

echo "Testing Response::success()...\n";
echo "Test data: " . json_encode($testData) . "\n\n";

Response::success([
    'ticket_id' => 123,
    'subject' => 'Test',
    'issue_type' => 'Roads',
    'status' => 'Pending',
    'date_created' => '2025-01-01 10:00:00'
], "Ticket created successfully");
