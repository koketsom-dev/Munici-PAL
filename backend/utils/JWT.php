<?php
class JWT {
    public static function generate($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64Header = base64_encode($header);
        $base64Payload = base64_encode($payload);
        
        $secret = getenv('JWT_SECRET') ?: 'your-secret-key';
        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true);
        $base64Signature = base64_encode($signature);
        
        return "$base64Header.$base64Payload.$base64Signature";
    }
    
    public static function verify($token) {
        $secret = getenv('JWT_SECRET') ?: 'your-secret-key';
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        $signature = base64_decode($base64Signature);
        $expectedSignature = hash_hmac('sha256', "$base64Header.$base64Payload", $secret, true);
        
        return hash_equals($signature, $expectedSignature);
    }
    
    public static function decode($token) {
        if (!self::verify($token)) {
            return false;
        }
        
        $parts = explode('.', $token);
        $payload = base64_decode($parts[1]);
        
        return json_decode($payload, true);
    }
}
?>