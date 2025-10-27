<?php
class Database {
    private $host = "postgres_db";
    private $port = "5432";
    private $db_name = "municipal_main";
    private $username = "municipalAdmin";
    private $password = "Single-Guide-Card-Helpful4-Whispered";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            throw new Exception("Database connection failed: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
?>