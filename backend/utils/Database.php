<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = getenv('DB_HOST') ?: 'db';
        $this->db_name = getenv('DB_NAME') ?: 'myapp';
        $this->username = getenv('DB_USER') ?: 'myuser';
        $this->password = getenv('DB_PASSWORD') ?: 'mypassword';
    }

    public function connect() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "pgsql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }
        return $this->conn;
    }
}
?>