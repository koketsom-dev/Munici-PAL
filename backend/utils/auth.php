<?php
class Auth {
    public static function authenticate() {
        $headers = getallheaders();
        $token = null;
        
        // Get token from Authorization header
        if (isset($headers['Authorization'])) {
            if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
                $token = $matches[1];
            }
        }
        
        if (!$token) {
            Response::unauthorized('No token provided');
        }
        
        $decoded = JWT::decode($token);
        if (!$decoded) {
            Response::unauthorized('Invalid token');
        }
        
        // Check if token is expired
        if (isset($decoded['exp']) && $decoded['exp'] < time()) {
            Response::unauthorized('Token expired');
        }
        
        return $decoded;
    }
}
?>