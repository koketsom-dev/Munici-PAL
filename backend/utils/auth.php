<?php
class Auth {
    public static function authenticate() {
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Check if user is logged in
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type'])) {
            throw new Exception("User not authenticated");
        }

        // Validate session data exists and is valid
        $userId = $_SESSION['user_id'];
        $userType = $_SESSION['user_type'];
        $email = $_SESSION['email'] ?? '';
        $municipalityId = $_SESSION['municipality_id'] ?? 1;

        if (empty($userId) || empty($userType)) {
            throw new Exception("Invalid session data");
        }

        return [
            'user_id' => $userId,
            'user_type' => $userType,
            'email' => $email,
            'municipality_id' => $municipalityId
        ];
    }

    public static function login($userData) {
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Set session data
        $_SESSION['user_id'] = $userData['id'];
        $_SESSION['user_type'] = $userData['user_type'];
        $_SESSION['email'] = $userData['email'];
        $_SESSION['municipality_id'] = $userData['municipality_id'] ?? 1;

        // Regenerate session ID for security
        session_regenerate_id(true);
    }

    public static function logout() {
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Clear all session data
        $_SESSION = [];

        // Destroy the session
        session_destroy();

        // Clear the session cookie
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
    }

    public static function isLoggedIn() {
        // Start session if not already started
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        return isset($_SESSION['user_id']) && isset($_SESSION['user_type']);
    }
}
