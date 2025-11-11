<?php
// Enable detailed error logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/register_errors.log');

// Log the start of the request
error_log("=== Registration Request Started ===");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Content Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'Not set'));

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../utils/response.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get JSON input
    $raw_input = file_get_contents("php://input");
    error_log("Raw input received: " . $raw_input);
    
    $input = json_decode($raw_input, true);
    
    if (!$input) {
        error_log("JSON decode error: " . json_last_error_msg());
        Response::error('Invalid JSON input: ' . json_last_error_msg());
        exit;
    }

    error_log("Parsed input: " . print_r($input, true));

    // Validate required fields
    $required_fields = ['full_name', 'email', 'password', 'user_type', 'municipality_id'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            error_log("Missing field: $field");
            Response::error("Missing required field: $field");
            exit;
        }
    }

    // Validate email format
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        Response::error('Invalid email format');
        exit;
    }

    // Validate password length
    if (strlen($input['password']) < 6) {
        Response::error('Password must be at least 6 characters long');
        exit;
    }

    error_log("Connecting to database...");
    $database = new Database();
    $db = $database->connect();
    
    if (!$db) {
        error_log("Database connection failed");
        Response::error('Database connection failed');
        exit;
    }
    error_log("Database connected successfully");

    // Check if user already exists
    $check_query = "SELECT email FROM CommunityUser WHERE email = :email 
                    UNION 
                    SELECT email FROM Employee WHERE email = :email";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':email', $input['email']);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        error_log("User already exists: " . $input['email']);
        Response::error('User with this email already exists');
        exit;
    }

    // Hash password
    $hashed_password = password_hash($input['password'], PASSWORD_DEFAULT);
    error_log("Password hashed successfully");

    if ($input['user_type'] === 'employee') {
        // Register as Employee
        error_log("Registering as employee");
        $query = "INSERT INTO Employee (
                    municipality_id, first_name, surname, email, password, 
                    access_level, emp_job_title, province, gender, home_language
                  ) VALUES (
                    :municipality_id, :first_name, :surname, :email, :password,
                    :access_level, :job_title, :province, :gender, :home_language
                  )";
        
        $stmt = $db->prepare($query);
        
        // Split full name into first and last name
        $name_parts = explode(' ', $input['full_name'], 2);
        $first_name = $name_parts[0];
        $surname = isset($name_parts[1]) ? $name_parts[1] : $name_parts[0];
        
        $access_level = $input['access_level'] ?? 'Employee';
        $job_title = $input['job_title'] ?? 'Employee';
        $province = $input['province'] ?? 'Gauteng';
        $gender = $input['gender'] ?? 'Other';
        $home_language = $input['home_language'] ?? 'English';
        
        error_log("Employee data - First: $first_name, Last: $surname, Access: $access_level, Job: $job_title, Gender: $gender, Language: $home_language");
        
        $stmt->bindParam(':municipality_id', $input['municipality_id']);
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':surname', $surname);
        $stmt->bindParam(':email', $input['email']);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':access_level', $access_level);
        $stmt->bindParam(':job_title', $job_title);
        $stmt->bindParam(':province', $province);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':home_language', $home_language);

    } else {
        // Register as Community User
        error_log("Registering as community user");
        $query = "INSERT INTO CommunityUser (
                    municipality_id, full_name, email, password, gender, home_language
                  ) VALUES (
                    :municipality_id, :full_name, :email, :password, :gender, :home_language
                  )";
        
        $stmt = $db->prepare($query);
        
        $gender = $input['gender'] ?? 'Other';
        $home_language = $input['home_language'] ?? 'English';
        
        error_log("Community user data - Full: {$input['full_name']}, Gender: $gender, Language: $home_language");
        
        $stmt->bindParam(':municipality_id', $input['municipality_id']);
        $stmt->bindParam(':full_name', $input['full_name']);
        $stmt->bindParam(':email', $input['email']);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':home_language', $home_language);
    }

    error_log("Executing query: " . $query);
    if ($stmt->execute()) {
        $user_id = $db->lastInsertId();
        error_log("User registered successfully with ID: $user_id");
        
        Response::success('User registered successfully', [
            'user_id' => $user_id,
            'user_type' => $input['user_type'],
            'email' => $input['email']
        ]);
    } else {
        $errorInfo = $stmt->errorInfo();
        error_log("Database execution error: " . print_r($errorInfo, true));
        Response::error('Failed to register user: ' . ($errorInfo[2] ?? 'Unknown error'));
    }

} catch (Exception $e) {
    error_log("Registration exception: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    Response::error('Registration failed: ' . $e->getMessage());
}