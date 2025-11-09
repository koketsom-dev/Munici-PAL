<?php
require_once '../bootstrap.php';
require_once '../utils/Auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error("Method not allowed", 405);
}

try {
    $auth = Auth::authenticate();
    $userId = $auth['user_id'];
    $userType = $auth['user_type'] ?? 'community';

    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        Response::error('Invalid JSON input');
    }

    $database = new Database();
    $db = $database->connect();

    if (!$db) {
        throw new Exception("Database connection failed");
    }

    if ($userType === 'employee') {
        $firstName = $input['first_name'] ?? '';
        $surname = $input['surname'] ?? '';
        $email = $input['email'] ?? '';
        $gender = $input['gender'] ?? '';
        $homeLanguage = $input['home_language'] ?? '';
        $jobTitle = $input['emp_job_title'] ?? '';
        $province = $input['province'] ?? '';
        $password = isset($input['password']) && !empty($input['password']) ? $input['password'] : null;

        $query = "UPDATE Employee SET 
                    first_name = :first_name,
                    surname = :surname,
                    email = :email,
                    gender = :gender,
                    home_language = :home_language,
                    emp_job_title = :job_title,
                    province = :province";

        if ($password) {
            if (strlen($password) < 6) {
                Response::error('Password must be at least 6 characters long');
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $query .= ", password = :password";
        }

        $query .= " WHERE id = :user_id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':first_name', $firstName);
        $stmt->bindParam(':surname', $surname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':home_language', $homeLanguage);
        $stmt->bindParam(':job_title', $jobTitle);
        $stmt->bindParam(':province', $province);
        if ($password) {
            $stmt->bindParam(':password', $hashedPassword);
        }
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);

    } else {
        $fullName = $input['full_name'] ?? '';
        $email = $input['email'] ?? '';
        $gender = $input['gender'] ?? '';
        $homeLanguage = $input['home_language'] ?? '';
        $password = isset($input['password']) && !empty($input['password']) ? $input['password'] : null;

        $query = "UPDATE CommunityUser SET 
                    full_name = :full_name,
                    email = :email,
                    gender = :gender,
                    home_language = :home_language";

        if ($password) {
            if (strlen($password) < 6) {
                Response::error('Password must be at least 6 characters long');
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $query .= ", password = :password";
        }

        $query .= " WHERE id = :user_id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':full_name', $fullName);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':home_language', $homeLanguage);
        if ($password) {
            $stmt->bindParam(':password', $hashedPassword);
        }
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
    }

    if ($stmt->execute()) {
        Response::success([], "Profile updated successfully");
    } else {
        $errorInfo = $stmt->errorInfo();
        Response::error("Failed to update profile: " . ($errorInfo[2] ?? 'Unknown error'));
    }

} catch (Exception $e) {
    error_log("Update profile error: " . $e->getMessage());
    Response::error("Failed to update profile: " . $e->getMessage());
}
