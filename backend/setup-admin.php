<?php
require_once 'bootstrap.php';
require_once 'utils/Database.php';

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $email = 'admin@munici-pal.com';
    $password = 'admin123';
    $first_name = 'System';
    $surname = 'Administrator';
    $emp_code = 1001;
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $query = "INSERT INTO Employee (
        email, password, first_name, surname, emp_code, 
        municipality_id, access_level, is_active, emp_job_title
    ) VALUES (
        :email, :password, :first_name, :surname, :emp_code,
        1, 'Admin', true, 'System Administrator'
    ) RETURNING id";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':first_name', $first_name);
    $stmt->bindParam(':surname', $surname);
    $stmt->bindParam(':emp_code', $emp_code);
    
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Admin account created successfully',
        'credentials' => [
            'email' => $email,
            'password' => $password,
            'id' => $result['id']
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
