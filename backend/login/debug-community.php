<?php
require_once '../bootstrap.php';

header('Content-Type: text/plain');

try {
    $database = new Database();
    $db = $database->connect();
    
    echo "=== COMMUNITY USER DEBUG ===\n\n";
    
    $email = "community@test.com";
    
    // Check if community user exists
    $userCheck = $db->prepare("SELECT * FROM communityuser WHERE email = :email");
    $userCheck->bindParam(':email', $email);
    $userCheck->execute();
    $user = $userCheck->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "✅ User FOUND:\n";
        echo "ID: " . $user['id'] . "\n";
        echo "Email: " . $user['email'] . "\n";
        echo "Full Name: " . $user['full_name'] . "\n";
        echo "Is Banned: " . ($user['is_banned'] ? "YES" : "NO") . "\n";
        echo "Password Hash: " . $user['password'] . "\n";
        echo "Password Length: " . strlen($user['password']) . "\n";
        
        // Test password verification
        $testPassword = "password";
        $passwordMatch = password_verify($testPassword, $user['password']);
        echo "Password 'password' matches: " . ($passwordMatch ? "YES" : "NO") . "\n";
        
        if (!$passwordMatch) {
            echo "\nTrying alternative passwords:\n";
            $altPasswords = ['123456', 'test', 'community'];
            foreach ($altPasswords as $altPwd) {
                $match = password_verify($altPwd, $user['password']);
                echo "Password '$altPwd': " . ($match ? "MATCH" : "no match") . "\n";
            }
        }
        
    } else {
        echo "❌ User NOT FOUND with email: $email\n";
        
        // Show all community users
        echo "\nAll Community Users:\n";
        $allUsers = $db->query("SELECT email, full_name FROM communityuser LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($allUsers as $u) {
            echo "- " . $u['email'] . " (" . $u['full_name'] . ")\n";
        }
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>
