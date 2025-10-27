# Create the PHP file with proper content
$phpContent = @'
<?php
header('Content-Type: text/plain');

$password = "password";
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: " . $password . "\n";
echo "Generated Hash: " . $hash . "\n";
echo "Hash Length: " . strlen($hash) . "\n";

// Test verification
$verify = password_verify($password, $hash);
echo "Self-Verification: " . ($verify ? "SUCCESS" : "FAILED") . "\n";

// Test against the known working hash
$knownHash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
$knownVerify = password_verify($password, $knownHash);
echo "Known Hash Verification: " . ($knownVerify ? "SUCCESS" : "FAILED") . "\n";
?>
'@

# Save the file
$phpContent | Out-File -FilePath "backend/login/generate-correct-hash.php" -Encoding UTF8

Write-Host "✅ PHP file created successfully!" -ForegroundColor Green