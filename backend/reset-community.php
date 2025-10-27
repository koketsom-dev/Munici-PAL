<?php
require_once '../bootstrap.php';

header('Content-Type: text/plain');

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "=== RESET COMMUNITY PASSWORD ===\n\n";
    
    $email = "community@test.com";
    $newPassword = "password";
    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    
    echo "New Hash: " . $newHash . "\n\n";
    
    // Update community user
    $update = $db->prepare("UPDATE communityuser SET password = :password WHERE email = :email");
    $update->bindParam(':password', $newHash);
    $update->bindParam(':email', $email);
    $result = $update->execute();
    
    echo "Update result: " . ($result ? "SUCCESS" : "FAILED") . "\n";
    
    // Verify
    $verify = $db->prepare("SELECT email, password FROM communityuser WHERE email = :email");
    $verify->bindParam(':email', $email);
    $verify->execute();
    $user = $verify->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $passwordMatch = password_verify($newPassword, $user['password']);
        echo "Verification: " . ($passwordMatch ? "PASSWORD WORKS" : "PASSWORD STILL WRONG") . "\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
