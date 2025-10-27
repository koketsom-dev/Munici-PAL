<?php
class PostgreSQLUtils {
    
    // Escape identifiers for PostgreSQL
    public static function escapeIdentifier($identifier) {
        return '"' . str_replace('"', '""', $identifier) . '"';
    }

    // Generate WHERE clause for filtering
    public static function buildWhereClause($filters) {
        $conditions = [];
        $params = [];

        foreach ($filters as $key => $value) {
            if ($value === null) {
                $conditions[] = "$key IS NULL";
            } else if (is_array($value)) {
                $placeholders = [];
                foreach ($value as $i => $item) {
                    $param_name = "{$key}_{$i}";
                    $placeholders[] = ":$param_name";
                    $params[$param_name] = $item;
                }
                $conditions[] = "$key IN (" . implode(', ', $placeholders) . ")";
            } else {
                $conditions[] = "$key = :$key";
                $params[$key] = $value;
            }
        }

        $where = $conditions ? "WHERE " . implode(' AND ', $conditions) : "";
        return ['clause' => $where, 'params' => $params];
    }

    // Build pagination SQL
    public static function buildPagination($page = 1, $per_page = 20) {
        $offset = ($page - 1) * $per_page;
        return "LIMIT $per_page OFFSET $offset";
    }

    // Convert PHP date to PostgreSQL timestamp
    public static function toPgTimestamp($php_date) {
        return date('Y-m-d H:i:s', strtotime($php_date));
    }

    // Handle PostgreSQL arrays - Convert PHP array to PostgreSQL array format
    public static function toPgArray($php_array) {
        if (empty($php_array)) return '{}';
        
        $escaped_array = array_map(function($item) {
            // Escape quotes and backslashes
            $item = str_replace('\\', '\\\\', $item);
            $item = str_replace('"', '\\"', $item);
            return '"' . $item . '"';
        }, $php_array);
        
        return '{' . implode(',', $escaped_array) . '}';
    }

    // Parse PostgreSQL array to PHP array - FIXED VERSION
    public static function fromPgArray($pg_array) {
        if (empty($pg_array)) return [];
        
        // Handle NULL or empty array
        if ($pg_array === '{}') return [];
        
        // Remove the curly braces
        $array_string = trim($pg_array, '{}');
        
        if (empty($array_string)) return [];
        
        // Parse the array manually to handle quoted elements
        $result = [];
        $current = '';
        $in_quotes = false;
        $escape_next = false;
        
        for ($i = 0; $i < strlen($array_string); $i++) {
            $char = $array_string[$i];
            
            if ($escape_next) {
                $current .= $char;
                $escape_next = false;
                continue;
            }
            
            if ($char === '\\') {
                $escape_next = true;
                continue;
            }
            
            if ($char === '"') {
                $in_quotes = !$in_quotes;
                continue;
            }
            
            if ($char === ',' && !$in_quotes) {
                $result[] = $current;
                $current = '';
                continue;
            }
            
            $current .= $char;
        }
        
        // Add the last element
        if (!empty($current)) {
            $result[] = $current;
        }
        
        return $result;
    }

    // Alternative method using PostgreSQL string_to_array function (requires database connection)
    public static function fromPgArrayViaQuery($db_connection, $pg_array) {
        if (empty($pg_array)) return [];
        
        try {
            $stmt = $db_connection->prepare("SELECT unnest(:array::text[]) as element");
            $stmt->bindValue(':array', $pg_array);
            $stmt->execute();
            
            $result = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $result[] = $row['element'];
            }
            
            return $result;
        } catch (Exception $e) {
            error_log("Error parsing PostgreSQL array: " . $e->getMessage());
            return [];
        }
    }

    // Simple method for basic arrays (no quotes or commas in elements)
    public static function fromPgArraySimple($pg_array) {
        if (empty($pg_array)) return [];
        
        $array_string = trim($pg_array, '{}');
        if (empty($array_string)) return [];
        
        return explode(',', $array_string);
    }

    // Build ORDER BY clause
    public static function buildOrderBy($sort_field = 'created_at', $sort_order = 'DESC') {
        $allowed_orders = ['ASC', 'DESC'];
        $sort_order = in_array(strtoupper($sort_order), $allowed_orders) ? $sort_order : 'DESC';
        
        return "ORDER BY $sort_field $sort_order";
    }

    // Sanitize for PostgreSQL LIKE queries
    public static function escapeLike($value) {
        return str_replace(['\\', '_', '%'], ['\\\\', '\\_', '\\%'], $value);
    }

    // Build ILIKE (case-insensitive) search condition
    public static function buildSearchCondition($fields, $search_term) {
        $conditions = [];
        $escaped_term = self::escapeLike($search_term);
        
        foreach ((array)$fields as $field) {
            $conditions[] = "$field ILIKE :search_term";
        }
        
        return implode(' OR ', $conditions);
    }
}
?>