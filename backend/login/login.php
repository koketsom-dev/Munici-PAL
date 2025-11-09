<?php
require_once '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error("Method not allowed", 405);
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);

$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$user_type = $input['user_type'] ?? '';

// Validate input
if (empty($email) || empty($password) || empty($user_type)) {
    Response::error("Email, password and user type are required");
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Authenticate based on user type
    if ($user_type === 'employee') {
        $user = authenticateEmployee($db, $email, $password);
    } else {
        $user = authenticateCommunityUser($db, $email, $password);
    }

    if (!$user) {
        Response::error("Invalid email or password", 401);
    }

    // Update last login
    updateLastLogin($db, $user['user_type'], $user['id']);

    // Set session data using Auth::login
    Auth::login($user);

    // Prepare response
    $responseData = [
        'user' => $user,
        'redirect_to' => $user['user_type'] === 'employee'
            ? '/dashboard'
            : '/community'
    ];

    Response::success($responseData, "Login successful");

} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    Response::error("Login failed");
}

/**
 * Authenticate employee
 */
function authenticateEmployee($db, $email, $password) {
    $query = "SELECT e.id, e.first_name, e.surname, e.email, e.password, 
                     e.municipality_id, m.municipality_name,
                     e.access_level, e.emp_code, e.emp_job_title,
                     e.ticket_alloc_road, e.ticket_alloc_electricity, 
                     e.ticket_alloc_water, e.ticket_alloc_refuse
              FROM employee e 
              JOIN municipalityregion m ON e.municipality_id = m.municipality_id 
              WHERE e.email = :email AND e.is_active = true";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($employee && password_verify($password, $employee['password'])) {
        unset($employee['password']);
        
        return [
            'user_type' => 'employee',
            'id' => $employee['id'],
            'first_name' => $employee['first_name'],
            'surname' => $employee['surname'],
            'full_name' => $employee['first_name'] . ' ' . $employee['surname'],
            'email' => $employee['email'],
            'municipality_id' => $employee['municipality_id'],
            'municipality_name' => $employee['municipality_name'],
            'access_level' => $employee['access_level'],
            'emp_code' => $employee['emp_code'],
            'job_title' => $employee['emp_job_title'],
            'ticket_allocations' => [
                'road' => (bool)$employee['ticket_alloc_road'],
                'electricity' => (bool)$employee['ticket_alloc_electricity'],
                'water' => (bool)$employee['ticket_alloc_water'],
                'refuse' => (bool)$employee['ticket_alloc_refuse']
            ]
        ];
    }
    
    return false;
}

/**
 * Authenticate community user
 */
function authenticateCommunityUser($db, $email, $password) {
    $query = "SELECT cu.id, cu.full_name, cu.email, cu.password, 
                     cu.municipality_id, m.municipality_name,
                     cu.is_moderator, cu.issue_report_count
              FROM communityuser cu 
              JOIN municipalityregion m ON cu.municipality_id = m.municipality_id 
              WHERE cu.email = :email AND cu.is_banned = false";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    $communityUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($communityUser && password_verify($password, $communityUser['password'])) {
        unset($communityUser['password']);
        
        return [
            'user_type' => 'community_user',
            'id' => $communityUser['id'],
            'full_name' => $communityUser['full_name'],
            'email' => $communityUser['email'],
            'municipality_id' => $communityUser['municipality_id'],
            'municipality_name' => $communityUser['municipality_name'],
            'is_moderator' => (bool)$communityUser['is_moderator'],
            'issue_report_count' => (int)$communityUser['issue_report_count']
        ];
    }
    
    return false;
}

/**
 * Update last login timestamp
 */
function updateLastLogin($db, $userType, $userId) {
    try {
        $table = $userType === 'employee' ? 'employee' : 'communityuser';
        $query = "UPDATE $table SET last_login = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
    } catch (Exception $e) {
        error_log("Failed to update last login: " . $e->getMessage());
    }
}