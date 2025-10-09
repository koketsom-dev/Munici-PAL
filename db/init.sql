CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

INSERT INTO users (name, email) VALUES
('Koketso', 'koketso@example.com'),
('Moiloa', 'moiloa@example.com');
