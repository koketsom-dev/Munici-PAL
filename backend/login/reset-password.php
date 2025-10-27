<?php
require_once '../bootstrap.php';

header('Content-Type: text/plain');

try {
    $database = new Database();
    $db = $database->connect();

    echo "=== PASSWORD RESET TOOL ===\n\n";

    // Generate fresh password hash for "password"
    $newPasswordHash = password_hash('password', PASSWORD_DEFAULT);
    
    echo "Generated Hash: " . $newPasswordHash . "\n\n";

    // Update employee password
    $updateEmployee = $db->prepare("UPDATE employee SET password = :password WHERE email = 'admin@municipal.gov.za'");
    $updateEmployee->bindParam(':password', $newPasswordHash);
    $employeeUpdated = $updateEmployee->execute();
    echo "Employee password updated: " . ($employeeUpdated ? "SUCCESS" : "FAILED") . "\n";

    // Update community user password  
    $updateCommunity = $db->prepare("UPDATE communityuser SET password = :password WHERE email = 'community@test.com'");
    $updateCommunity->bindParam(':password', $newPasswordHash);
    $communityUpdated = $updateCommunity->execute();
    echo "Community user password updated: " . ($communityUpdated ? "SUCCESS" : "FAILED") . "\n";

    // Verify the updates
    echo "\n=== VERIFICATION ===\n";
    $employee = $db->query("SELECT email, password FROM employee WHERE email = 'admin@municipal.gov.za'")->fetch(PDO::FETCH_ASSOC);
    $community = $db->query("SELECT email, password FROM communityuser WHERE email = 'community@test.com'")->fetch(PDO::FETCH_ASSOC);

    if ($employee) {
        $employeeVerify = password_verify('password', $employee['password']);
        echo "Employee: " . $employee['email'] . " - Verify: " . ($employeeVerify ? "SUCCESS" : "FAILED") . "\n";
    } else {
        echo "Employee: NOT FOUND\n";
    }

    if ($community) {
        $communityVerify = password_verify('password', $community['password']);
        echo "Community: " . $community['email'] . " - Verify: " . ($communityVerify ? "SUCCESS" : "FAILED") . "\n";
    } else {
        echo "Community: NOT FOUND\n";
    }

    echo "\n=== TEST INSTRUCTIONS ===\n";
    echo "Use email: admin@municipal.gov.za\n";
    echo "Use password: password\n";
    echo "Test URL: http://localhost:3002\n";

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>